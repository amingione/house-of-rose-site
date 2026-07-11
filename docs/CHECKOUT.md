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
                        Stripe confirms ──► stripe-webhook
                                              1. order → paid
                                              2. buy Shippo label → shipped
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
| `netlify/functions/stripe-webhook.ts` | Marks paid, buys the label. |

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

**The webhook marks paid FIRST, then buys the label.** If the label fails, the money is
already captured — we must never lose the order. A label failure is recorded on
`order.fulfillmentError` and returns **200**, because a 500 makes Stripe retry and risk
buying a *second* label. Check `fulfillmentError` in the Studio: those orders are paid
but need a label bought by hand.

**The cart drawer binds once; the buttons bind per-navigation.** The drawer lives
outside `<main>` and survives swup; the buttons don't. Re-binding the drawer on every
nav attached a second delegated listener and made `qty-up` increment by two.

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

**Stripe webhook endpoint:** `https://houseofrosefl.com/.netlify/functions/stripe-webhook`
Subscribe to `payment_intent.succeeded` and `payment_intent.payment_failed`.

---

## Before taking real money

1. Set the env vars above (test keys first).
2. Set `weightLb` on the heavy items (pounds — 0.25 lb ≈ a serum, a kit is 2–4 lb).
3. Place a test order end-to-end with Stripe test card `4242 4242 4242 4242` — confirm
   an `order` appears in the Studio as `shipped` with a label URL.
4. **Confirm the brands allow online resale.** Face Reality requires a fully-executed
   Supply Agreement, and pro lines commonly restrict online sale and enforce MAP
   pricing. This is a business blocker, not a technical one — check before listing 125
   priced SKUs publicly.
5. Register for Florida sales tax if you haven't. `tax` is currently `0` on every
   order; wiring Stripe Tax is a one-line change once you're registered.
