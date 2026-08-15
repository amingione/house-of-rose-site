# Color & Contrast System

**Binding.** Every content/UI task inherits these rules. Enforced target: **WCAG 2.1 AA** —
4.5:1 for body text, 3:1 for large text (≥24px, or ≥18.66px bold) and UI borders.

---

## Why this exists

The palette was originally authored for a **dark** theme, then flipped to a **light** one by
remapping the tokens (`charcoal` → ivory, `cream` → ink). The *surfaces* flipped; the
*accents* didn't. Result:

| Token | Usages | Contrast on ivory `#F4ECDC` | Verdict |
|---|---|---|---|
| `text-gold` `#C9A24B` | 147 | **2.04:1** | fail |
| `text-[#9a8c78]` | 79 | **2.80:1** | fail |
| `text-[#777]` | 31 | **3.81:1** | fail |
| `text-[#999]` | 16 | **2.43:1** | fail |
| `.learn-more` (gold @ 50%) | — | **~1.4:1** | severe |
| Header nav on a hero-less page | all | **1.00:1** | invisible |

Patching 300+ class usages would have re-broken the moment someone added a page. The fix is
at the **token** layer instead.

---

## The model: two gold roles

Gold cannot be one colour. No single gold clears 4.5:1 on *both* ivory and walnut. So:

### 1. `gold` — context-aware TEXT / OUTLINE accent
Resolves through the `--hr-gold` CSS variable and **flips automatically** by surface:

| Surface | Value | Contrast |
|---|---|---|
| light (default) | `#7A5C2A` | 5.27:1 on ivory · 4.54:1 on taupe |
| inside `.on-dark` | `#E7D6A8` | 9.19:1 on walnut · 13.9:1 on hero scrim |

Use for: `text-gold`, `border-gold`, `outline-gold`.

### 2. `gold-metal` — fixed decorative bronze `#8A6A43`
Use for hairline rules and low-opacity decorative fills or borders, not as a solid background behind
text. The current `text-ink` pairing is only 4.26:1 and does not meet the body/small-text target.

> ⚠️ **Never write `text-gold-metal`** — that reintroduces the 2:1 failure.

`muted` works the same way (`--hr-muted`): `#5E5548` (6.23:1) on light, `#D8CFC0` (8.58:1)
inside `.on-dark`. It replaces every hardcoded grey.

---

## `.on-dark` — the one thing you must remember

Put `.on-dark` on **any container whose background is dark** (walnut band, photo hero,
near-black scrim). Every `gold` and `muted` descendant inverts automatically.

```html
<section class="on-dark bg-walnut">
  <span class="kicker">Our Approach</span>   <!-- champagne gold, 9.19:1 -->
  <p class="text-muted">Body copy…</p>       <!-- warm off-white, 8.58:1 -->
</section>
```

Forget it and gold/muted stay dark → dark-on-dark. Add it to a *light* band and they go
pale → light-on-light. Match the marker to the actual surface.

### `.hero-dark` — page-top heroes only
`.hero-dark` additionally means *"this page opens with a dark surface behind the header."*

The header is transparent with **ivory** nav text, which only works over a photo hero. Pages
without one (`/faq/`, `/areas/`, `/results/`, `/privacy-policy/`, `/sitemap/`, `/thank-you/`)
were rendering ivory nav on the ivory page — a **1:1 ratio, invisible** until the user
scrolled far enough to trigger `.stuck`. (This was the reported "mobile menu is hard to read
until the white background recedes" bug.)

`global.css` resolves it at first paint, before any JS:

```css
body:not(:has(.hero-dark)) #header:not(.stuck) { /* solid ivory bar, ink nav */ }
```

The Header script adds `.solid` as a fallback for engines without `:has()`. **A new page with
no dark hero gets a solid, legible header for free — no per-page flag.**

---

## Rules for new work

1. Dark background? → add `.on-dark`. Page-top dark hero? → also `.hero-dark`.
2. Gold as text/border → `text-gold` / `border-gold`. Keep `bg-gold-metal` decorative; do not place
   text directly on it.
3. Secondary text → `text-muted`. **Never hardcode a hex** (`text-[#999]` etc.).
4. No text below **11px**, and no tracking above **0.26em** on uppercase micro-type.
   (10px @ 0.4em was unreadable regardless of colour.)
5. Never set a text colour below ~70% opacity — the alpha eats the contrast budget.
6. `btn-outline-white` and `btn-outline-gold` both use ivory text and borders on transparent
   backgrounds: **dark surfaces only**. Neither is a light-surface fallback; any future light-surface
   variant must be independently contrast-tested before use.

## Verifying

Contrast was validated by rendering the built site and computing the true ratio for every
text node against its effective (layer-aware) background:

```
2,469 text nodes across 20 page templates → 0 failures
```

Re-run after significant changes: build, serve `dist/`, and audit computed styles against
the composited backdrop — assuming the *worst-case* photo pixel under each hero scrim.
