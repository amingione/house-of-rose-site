# Checkout & Shipping

Stripe Elements + Shippo, on top of Sanity. Written 2026-07-11.

**Binding rule: the browser never names a price.** It sends product ids and
quantities. Everything that determines the amount — line prices, shipping — is
recomputed server-side. Break this and the shop becomes free.

---

## Why not the obvious options

**GlossGenius can't do it.** It has no online store and no way to display products on
the booking site — [their own docs say so](https://glossgenius.elevio.help/en/articles/682-can-i-sell-products-online)
and recommend linking out. GlossGenius remains booking + in-person retail POS. It is
**not** the checkout, and `SHOP-ARCHITECTURE.md` was wrong when it said otherwise.

**Not hosted Stripe Checkout.** Hosted Checkout takes a *static* `shipping_options`
list, so it can't price a real parcel against the address the customer is typing —
you'd be stuck with a flat rate or a zone table. Elements lets us own the page, so the
Address Element drives a live Shippo quote for this exact cart to this exact address.

**No Stripe Product/Price mirror.** Prices live in Sanity, full stop. Mirroring them
into Stripe means a sync script and a whole class of drift bugs ("why is the site
charging the old price?"). The server reads Sanity on every request instead.

---

## The flow

```
   Cart (nanostores + localStorage)
        │  [{ productId, quantity }]
        ▼
/checkout  ──► Address Element `change` (complete)
        │
        ├──► POST shipping-rates ──► Sanity (weights) ──► Shippo ──► live rates
        │         customer picks one; elements.update({ amount })  ← DISPLAY ONLY
        │
        └──► submit ──► POST create-payment-intent
                          ├─ re-read prices from Sanity      ← authoritative
                          ├─ re-read chosen rate from Shippo ← authoritative
                          ├─ write `order` (pending) to Sanity
                          └─ create PaymentIntent(amount = subtotal + shipping)
                                    │
                                    ▼
                        Stripe confirms
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
   browser → /order-confirmed/        stripe-webhook
     · verifies the PaymentIntent       1. order → paid
     · CLEARS THE CART                  2. Resend: order confirmation email
     · "thanks, email coming"           3. NO LABEL BOUGHT — deliberate

   ...Amber checks the order, then ticks `buyLabel` in the Studio
              │
              ▼
   Sanity webhook → buy-label ──► Shippo: buy postage → status `readyToShip`
              │                   (re-quotes if the original rate expired)
              ▼
   ...she packs it, prints the label, drops it off, sets status `shipped`
              │
              ▼
   Sanity webhook → order-shipped ──► Resend: "on its way" + tracking
```

### Files

| File | Job |
|---|---|
| `src/stores/cart.ts` | Cart state. Persists to `localStorage`. `unitPrice` here is **display only**. |
| `src/components/shop/CartDrawer.astro` | Slide-in cart. Mounted once in `BaseLayout` (outside `<main>`) so swup never replaces it. |
| `src/pages/checkout.astro` | Elements (deferred intent), Address Element, live rates, confirm. |
| `netlify/functions/_lib/cart.ts` | **The trust boundary.** Resolves `{id, qty}` → real prices/weights from Sanity. |
| `netlify/functions/_lib/shippo.ts` | Shippo over REST (no SDK — it has churned through breaking majors). |
| `netlify/functions/shipping-rates.ts` | Live carrier rates for this cart + address. |
| `netlify/functions/create-payment-intent.ts` | Recomputes the amount, writes the order, creates the PaymentIntent. |
| `netlify/functions/stripe-webhook.ts` | Marks paid, emails the confirmation. **Buys nothing.** |
| `netlify/functions/buy-label.ts` | Sanity webhook → buys postage when Amber ticks `buyLabel`. |
| `netlify/functions/order-shipped.ts` | Sanity webhook → emails tracking when Amber marks it shipped. |
| `netlify/functions/_lib/email.ts` | Resend (REST, no SDK). Both customer emails. Best-effort by design. |
| `src/pages/order-confirmed.astro` | Stripe `return_url`. Verifies the intent, **clears the cart**, thanks them. |

---

## Traps, and why the code looks like it does

**Never `return Astro.redirect()` from a prerendered page.** It stops Astro emitting
the sibling index chunk and breaks the whole build with a baffling
`Cannot find module dist/pages/shop.astro.mjs`. This already cost us a build outage —
see the comment in `shop/[slug].astro`.

**The order is written to Sanity BEFORE payment.** Stripe metadata caps at ~500
chars/value, nowhere near enough for a line-item cart. So Stripe carries only the
Sanity `_id` and the durable record lives here. An abandoned checkout leaves a
`pending` order behind — that's useful data, not a bug.

**Labels are NEVER bought automatically.** Payment succeeding does not buy postage. It
would mean spending real money the instant a card clears, before a human has looked at
anything — and a fraudulent card that later charges back costs us the goods *and* the
postage. `inStock` is hand-maintained and goes stale. Stripe validates an address's
FORMAT, not its deliverability. An under-entered `weightLb` yields a label USPS quietly
bills an adjustment for. All cheaper to catch before we've paid the carrier.

So Amber ticks **`buyLabel`** on a paid order in the Studio, which fires `buy-label.ts`.
It's idempotent (refuses if `shippoTransactionId` exists — Sanity retries webhooks, and
two labels means paying twice), and on failure it unticks the box and writes
`fulfillmentError` so she can fix the address and retry. Nothing is charged for postage
on a failure.

**The cost of deferring is rate expiry.** Shippo rate objects go stale after about a
week, so the rate the customer paid against may no longer be purchasable. `buy-label`
re-quotes the same carrier + service and records what the postage *actually* cost in
`labelCost`. Compare it to `shippingCost` (what the client paid): a gap means the weight
was wrong or the rate moved. We absorb the difference rather than re-charging a customer
for our own delay.

**The cart drawer binds once; the buttons bind per-navigation.** The drawer lives
outside `<main>` and survives swup; the buttons don't. Re-binding the drawer on every
nav attached a second delegated listener and made `qty-up` increment by two.

**The cart is cleared on /order-confirmed/, NOT after `confirmPayment()`.** That call
redirects the browser away, so any `clearCart()` written after it is dead code — the
customer would land back on the site with a full cart and could pay for the same thing
twice. Only `/order-confirmed/` clears it, and only once Stripe itself reports the
intent as `succeeded` (a failed payment deliberately keeps the cart intact so they can
retry without rebuilding it).

**"Shipped" is a human fact, not a label-printing fact.** The webhook buys the Shippo
label seconds after payment, while the box is still on the counter. So the label does
NOT send the tracking email and does NOT set `status: shipped` — the order stays `paid`
with a label attached. Amber flips it to `shipped` in the Studio when the parcel
actually leaves; that fires the Sanity webhook → `order-shipped` → tracking email.
Emailing a tracking number that won't scan for two days teaches customers to ignore us.

**`elements.update({ amount })` is cosmetic.** It changes what Stripe *displays*. The
charged amount is whatever `create-payment-intent` computes. They can't disagree in the
customer's favour, because the PaymentIntent is created fresh at submit.

---

## Product setup (Sanity)

A product is **buyable online** when it has a `price` (in cents) and `inStock ≠ false`.
Otherwise the page falls back to `purchaseUrl` (external link), then to call-to-order.

- **`price`** — cents. `3200` = $32.00.
- **`weightLb`** — *packed* weight in **pounds**, bottle included. A 4 oz serum is
  ~0.35 lb packed. Decimals are fine. Defaults to 0.25 lb if blank, plus 0.2 lb
  packaging, and Shippo is told `mass_unit: 'lb'` — the unit is pounds end to end, on
  purpose. **Set this on anything heavy (kits, sets) or we under-charge shipping and eat
  the difference.** Carriers round up to the next pound, so we never quote below 1 lb.
- **`shippable`** — off for in-studio-only items. They can still be bought; the cart
  just skips shipping for them.
- **`purchaseUrl`** — now the **escape hatch**, not the default. Use it only for things
  we don't sell ourselves.

> ⚠️ **41 of 166 products currently have no `price`** and therefore show "Call to
> Order". That's correct behaviour, not a bug — but if they're meant to be sellable,
> they need prices.

---

## Environment variables

Set in Netlify (**Site settings → Environment variables**), and in
`packages/web/.env.local` for local dev. Only `PUBLIC_*` reaches the browser.

| Variable | Where | Notes |
|---|---|---|
| `PUBLIC_STRIPE_PUBLISHABLE_KEY` | browser | `pk_live_…` / `pk_test_…` |
| `STRIPE_SECRET_KEY` | server | `sk_…` — **never** prefix with `PUBLIC_` |
| `STRIPE_WEBHOOK_SECRET` | server | `whsec_…` from the webhook endpoint |
| `SHIPPO_API_KEY` | server | live vs test token |
| `SANITY_API_WRITE_TOKEN` | server | already set — writes orders |
| `SHIP_FROM_*` | server | optional; defaults to the studio NAP in `_lib/shippo.ts` |
| `RESEND_API_KEY` | server | already set — sends both customer emails |
| `ORDER_EMAIL_FROM` | server | optional; defaults to `House of Rose <orders@updates.houseofrosefl.com>` |
| `ORDER_EMAIL_REPLY_TO` | server | optional; defaults to `info@houseofrosefl.com` |
| `SANITY_WEBHOOK_SECRET` | server | **new** — shared secret for the `order-shipped` webhook |

> ⚠️ **`SANITY_API_WRITE_TOKEN` is NOT in `packages/web/.env.local`.** Checkout cannot
> write orders without it. It's set in Netlify, but local testing will fail until you add
> it locally too.

**Sanity webhooks (Manage → API → Webhooks) — TWO of them, both `POST`, both using
`SANITY_WEBHOOK_SECRET`, both projecting `{ _id }`, both triggering on **update**:**

| Function | Filter |
|---|---|
| `/.netlify/functions/buy-label` | `_type == "order" && buyLabel == true && !defined(shippoTransactionId)` |
| `/.netlify/functions/order-shipped` | `_type == "order" && status == "shipped"` |

**Stripe webhook endpoint:** `https://houseofrosefl.com/.netlify/functions/stripe-webhook`
Subscribe to `payment_intent.succeeded` and `payment_intent.payment_failed`.

---

## Testing the fulfilment flow locally

`netlify dev` will ask which workspace to run — it's a monorepo. **Always pick
`@house-of-rose/web`**; the studio has no functions. Skip the prompt entirely:

```zsh
npm run dev:functions        # netlify dev --filter @house-of-rose/web
```

Then, in another terminal, rehearse the whole fulfilment flow WITHOUT configuring a
single Sanity webhook — the CLI patches the doc and POSTs `{ _id }` to the real handler
exactly as Sanity would:

```zsh
npm run order -- seed          # fake a PAID order (no Stripe checkout needed)
npm run order -- label <id>    # tick buyLabel  → buy-label   → fake label + tracking
npm run order -- ship  <id>    # set shipped    → order-shipped → tracking email
npm run order -- ship  <id>    # should SKIP, not send a second email
npm run order -- cleanup       # delete the seeded TEST- orders
```

`seed` deliberately omits `shippoRateId`, which forces `buy-label` down its **re-quote**
branch — the path that only runs when a real rate has expired, and therefore the one
least likely to be exercised by accident.

`label` refuses to run against a LIVE Shippo token without `--yes-spend-real-money`.

---

## Before taking real money

1. Set the env vars above (test keys first).
2. Set `weightLb` on the heavy items (pounds — 0.25 lb ≈ a serum, a kit is 2–4 lb).
3. Place a test order end-to-end with Stripe test card `4242 4242 4242 4242`. Confirm:
   the order appears in the Studio as `paid` with **no label**, the confirmation email
   arrives, and the cart is empty afterwards. Then tick `buyLabel` → it should flip to
   `readyToShip` with a label URL and tracking. Then set `shipped` → the tracking email
   arrives exactly once. **Use a Shippo TEST token for this, or you will buy real
   postage.**
4. **Confirm the brands allow online resale.** Face Reality requires a fully-executed
   Supply Agreement, and pro lines commonly restrict online sale and enforce MAP
   pricing. This is a business blocker, not a technical one — check before listing 125
   priced SKUs publicly.
5. Register for Florida sales tax if you haven't. `tax` is currently `0` on every
   order; wiring Stripe Tax is a one-line change once you're registered.
