#!/usr/bin/env node
/**
 * Order CLI — exercise the checkout fulfilment flow without touching Sanity's webhook
 * config or the Studio UI.
 *
 *   npm run order -- list                 # recent orders
 *   npm run order -- seed                 # fake a PAID order (no Stripe needed)
 *   npm run order -- show    <orderId>
 *   npm run order -- label   <orderId>    # tick buyLabel  → fires buy-label
 *   npm run order -- ship    <orderId>    # set status shipped → fires order-shipped
 *   npm run order -- reset   <orderId>    # back to `paid`, strip label/tracking
 *   npm run order -- cleanup              # delete every seeded test order
 *
 * It does exactly what Sanity's webhook would: patches the document, then POSTs
 * `{ _id }` to the local function with the `sanity-webhook-secret` header. So you're
 * testing the real handler, not a mock of it.
 *
 * SAFETY: refuses to buy a label if SHIPPO_API_KEY is a LIVE token. Postage is real
 * money, and this script exists precisely so you can rehearse without spending any.
 * Override with --yes-spend-real-money if you ever genuinely mean it.
 *
 * Needs `netlify dev` running (default http://localhost:8888). Override with --url.
 */

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@sanity/client';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const ENV_PATH = resolve(ROOT, 'packages/web/.env.local');

// ── env ──────────────────────────────────────────────────────────────────────
function loadEnv() {
  const env = {};
  let raw;
  try {
    raw = readFileSync(ENV_PATH, 'utf8');
  } catch {
    die(`Can't read ${ENV_PATH}`);
  }
  for (const line of raw.split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#') || !t.includes('=')) continue;
    const [k, ...rest] = t.split('=');
    env[k.trim()] = rest.join('=').trim().replace(/^["']|["']$/g, '');
  }
  return env;
}

const env = loadEnv();
const args = process.argv.slice(2);
const cmd = args[0];
const flag = (name) => args.includes(`--${name}`);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
};

const FN_BASE = opt('url', 'http://localhost:8888') + '/.netlify/functions';
const SECRET = env.SANITY_WEBHOOK_SECRET;
const LIVE_SHIPPO = (env.SHIPPO_API_KEY ?? '').startsWith('shippo_live_');

const c = {
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
};

function die(msg) {
  console.error(`\n${c.red('✖')} ${msg}\n`);
  process.exit(1);
}

/** Checked lazily — the help screen must work without any credentials. */
function requireToken() {
  if (!env.SANITY_API_WRITE_TOKEN) {
    die(
      `SANITY_API_WRITE_TOKEN is missing from packages/web/.env.local.\n` +
        `  Nothing in checkout can write an order without it — not even a test one.\n` +
        `  Create one at https://sanity.io/manage (project 4e7axyi7 → API → Tokens, Editor).`,
    );
  }
}

const sanity = createClient({
  projectId: env.PUBLIC_SANITY_PROJECT_ID,
  dataset: env.PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: env.PUBLIC_SANITY_API_VERSION ?? '2025-04-26',
  token: env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const money = (cents) => `$${((cents ?? 0) / 100).toFixed(2)}`;

/** Do what a Sanity webhook does: POST { _id } with the shared secret. */
async function fire(fn, id) {
  if (!SECRET) {
    die(
      `SANITY_WEBHOOK_SECRET is missing from packages/web/.env.local.\n` +
        `  Both buy-label and order-shipped reject every request without it (401).\n` +
        `  Invent any long random string — it just has to match what you put in Sanity later.`,
    );
  }

  console.log(c.dim(`  → POST ${FN_BASE}/${fn}  { _id: "${id}" }`));

  let res;
  try {
    res = await fetch(`${FN_BASE}/${fn}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'sanity-webhook-secret': SECRET },
      body: JSON.stringify({ _id: id }),
    });
  } catch {
    die(`Couldn't reach ${FN_BASE}. Is \`netlify dev\` running?`);
  }

  const text = await res.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    body = text;
  }

  const ok = res.ok;
  console.log(`  ${ok ? c.green('←') : c.red('←')} ${res.status}`, body);
  return { ok, body };
}

// ── commands ─────────────────────────────────────────────────────────────────

async function list() {
  const orders = await sanity.fetch(
    `*[_type == "order"] | order(placedAt desc)[0...15]{
      _id, orderNumber, status, total, name, email, buyLabel, trackingNumber, labelCost, shippingCost
    }`,
  );
  if (!orders.length) return console.log(c.dim('\n  No orders yet. Try: npm run order -- seed\n'));

  console.log();
  for (const o of orders) {
    const badge =
      { pending: c.dim('pending'), paid: c.yellow('paid'), readyToShip: c.green('readyToShip'), shipped: c.green('shipped') }[
        o.status
      ] ?? o.status;
    console.log(
      `  ${c.bold(o.orderNumber ?? '—')}  ${badge.padEnd(20)} ${money(o.total)}  ${c.dim(o.email ?? '')}`,
    );
    console.log(`  ${c.dim(o._id)}`);
    if (o.trackingNumber) {
      const paid = o.shippingCost ?? 0;
      const cost = o.labelCost;
      const delta = cost !== undefined && cost !== paid ? c.yellow(`  (client paid ${money(paid)}, postage ${money(cost)})`) : '';
      console.log(`  ${c.dim('tracking')} ${o.trackingNumber}${delta}`);
    }
    console.log();
  }
}

async function show(id) {
  const o = await sanity.fetch(`*[_id == $id][0]`, { id });
  if (!o) die(`No order ${id}`);
  console.log(JSON.stringify(o, null, 2));
}

/**
 * Seed a PAID order without going through Stripe.
 *
 * Deliberately leaves `shippoRateId` empty, which forces buy-label down its re-quote
 * path — the branch that only runs when a real rate has expired, and therefore the one
 * least likely to get exercised by accident. Test the awkward path by default.
 */
async function seed() {
  const product = await sanity.fetch(
    `*[_type == "product" && defined(price) && price > 0 && inStock != false][0]{ _id, title, price, weightLb }`,
  );
  if (!product) die('No priced, in-stock product found to seed an order with.');

  const count = await sanity.fetch(`count(*[_type == "order"])`);
  const quantity = 2;
  const subtotal = product.price * quantity;
  const shippingCost = 800; // pretend they paid $8.00

  const order = await sanity.create({
    _type: 'order',
    orderNumber: `TEST-${1000 + count + 1}`,
    status: 'paid',
    placedAt: new Date().toISOString(),
    email: env.LEAD_NOTIFY_TO ?? 'info@houseofrosefl.com',
    name: 'Test Customer',
    phone: '+18449417673',
    items: [
      {
        _key: product._id,
        _type: 'orderItem',
        product: { _type: 'reference', _ref: product._id },
        title: product.title,
        quantity,
        unitPrice: product.price,
      },
    ],
    subtotal,
    shippingCost,
    tax: 0,
    total: subtotal + shippingCost,
    // A real, deliverable address — Shippo test mode still validates it.
    shippingAddress: {
      name: 'Test Customer',
      line1: '1600 Pennsylvania Avenue NW',
      city: 'Washington',
      state: 'DC',
      postalCode: '20500',
      country: 'US',
    },
    shippingMethod: 'USPS Priority Mail',
    // shippoRateId intentionally omitted → exercises the re-quote branch.
  });

  console.log(`\n  ${c.green('✔')} Seeded ${c.bold(order.orderNumber)} — ${quantity} × ${product.title}`);
  console.log(`  ${c.dim(order._id)}`);
  console.log(`\n  Next:  ${c.bold(`npm run order -- label ${order._id}`)}\n`);
}

async function label(id) {
  if (LIVE_SHIPPO && !flag('yes-spend-real-money')) {
    die(
      `SHIPPO_API_KEY is a ${c.bold('LIVE')} token — buying a label spends real postage.\n` +
        `  Swap in a shippo_test_ token, or re-run with --yes-spend-real-money if you mean it.`,
    );
  }
  if (LIVE_SHIPPO) console.log(c.red('\n  ⚠  LIVE Shippo token — this will spend real money.\n'));

  // This is the bit the Studio checkbox does.
  await sanity.patch(id).set({ buyLabel: true }).commit();
  console.log(`\n  ${c.dim('patched buyLabel = true')}`);

  const { body } = await fire('buy-label', id);

  const o = await sanity.fetch(
    `*[_id == $id][0]{ status, labelUrl, trackingNumber, labelCost, shippingCost, fulfillmentError }`,
    { id },
  );
  console.log();
  if (o.trackingNumber) {
    console.log(`  ${c.green('✔')} status ${c.bold(o.status)}  tracking ${c.bold(o.trackingNumber)}`);
    console.log(`  label: ${o.labelUrl}`);
    if (o.labelCost !== undefined) {
      console.log(`  client paid ${money(o.shippingCost)} · postage cost ${money(o.labelCost)}`);
    }
  } else {
    console.log(`  ${c.red('✖')} no label. ${o.fulfillmentError ?? JSON.stringify(body)}`);
  }
  console.log(`\n  Next:  ${c.bold(`npm run order -- ship ${id}`)}\n`);
}

async function ship(id) {
  await sanity.patch(id).set({ status: 'shipped' }).commit();
  console.log(`\n  ${c.dim('patched status = shipped')}`);

  await fire('order-shipped', id);

  const o = await sanity.fetch(`*[_id == $id][0]{ shippedEmailSentAt, email }`, { id });
  console.log();
  if (o.shippedEmailSentAt) {
    console.log(`  ${c.green('✔')} tracking email sent to ${c.bold(o.email)} at ${o.shippedEmailSentAt}`);
    console.log(c.dim('  Fire it again — it should skip, not send twice.'));
  } else {
    console.log(`  ${c.red('✖')} no email recorded.`);
  }
  console.log();
}

async function reset(id) {
  await sanity
    .patch(id)
    .set({ status: 'paid', buyLabel: false })
    .unset([
      'shippoTransactionId',
      'labelUrl',
      'trackingNumber',
      'trackingUrl',
      'labelCost',
      'shippedEmailSentAt',
      'fulfillmentError',
    ])
    .commit();
  console.log(`\n  ${c.green('✔')} ${id} reset to paid.\n`);
}

async function cleanup() {
  const ids = await sanity.fetch(`*[_type == "order" && orderNumber match "TEST-*"]._id`);
  if (!ids.length) return console.log(c.dim('\n  No seeded test orders.\n'));
  let tx = sanity.transaction();
  for (const id of ids) tx = tx.delete(id);
  await tx.commit();
  console.log(`\n  ${c.green('✔')} Deleted ${ids.length} test order(s).\n`);
}

// ── dispatch ─────────────────────────────────────────────────────────────────
const id = args[1]?.startsWith('--') ? undefined : args[1];

const needsId = (fn) => {
  if (!id) die(`Usage: npm run order -- ${cmd} <orderId>   (get one from: npm run order -- list)`);
  return fn(id);
};

const commands = {
  list,
  seed,
  cleanup,
  show: () => needsId(show),
  label: () => needsId(label),
  ship: () => needsId(ship),
  reset: () => needsId(reset),
};

if (commands[cmd]) {
  requireToken();
  await commands[cmd]();
} else {
  console.log(`
  ${c.bold('Order CLI')} ${c.dim('— rehearse fulfilment without Sanity webhooks or the Studio')}

    npm run order -- list                recent orders
    npm run order -- seed                fake a PAID order (no Stripe needed)
    npm run order -- show   <orderId>    dump the raw document
    npm run order -- label  <orderId>    tick buyLabel → fire buy-label
    npm run order -- ship   <orderId>    set shipped   → fire order-shipped
    npm run order -- reset  <orderId>    back to paid, strip label + tracking
    npm run order -- cleanup             delete every seeded TEST- order

  ${c.dim(`Needs \`netlify dev\` running (--url to override ${FN_BASE.replace('/.netlify/functions', '')}).`)}
  ${
    LIVE_SHIPPO
      ? c.red('  ⚠  SHIPPO_API_KEY is LIVE — `label` will refuse without --yes-spend-real-money.')
      : c.dim('  Shippo token is TEST — labels are fake and free.')
  }
  ${
    env.SANITY_API_WRITE_TOKEN
      ? ''
      : c.red('  ⚠  SANITY_API_WRITE_TOKEN is not set — every command will fail until it is.')
  }
`);
}
