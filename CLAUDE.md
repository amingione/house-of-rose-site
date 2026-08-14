# House of Rose — Working Memory

## ⚠️ Voice reset — binding as of 2026-08-13

Amber explicitly rejected the Claude-developed voice currently embedded in the Creative System,
brand memory, and website. Preserve verified facts and compliance rules, but do not extend,
paraphrase, or imitate the current clinical/institutional tone. In particular, do not treat
“selection / sequencing / indication / candidacy / accountability / documented standards” cadence
as brand personality. The replacement voice is pending Amber's approval. Until then, any new
brand-voice work is a clearly labeled working draft, not governing copy and not authorization for
a sitewide Sanity publish.

## ⚠️ Rule #0 — Verify before you assert or change (binding on EVERY task)
Anything that has to be **factually correct** — pricing, series counts, service names, descriptions,
provider lanes, hours, NAP, protocols — must be **checked against the real sources before I state or
change it**, and I do not invent, round, or "make it consistent" from memory.

The Creative System's prior Permanent Context Block is `[SUPERSEDED]`. Do not paste or paraphrase it.
For new work, use Amber's latest direction, verified operational facts, and the binding compliance
rules. Review clinical claims when they are new, materially changed, or unsupported; do not turn
routine copy into a clinical-process manifesto. The real-practice visual standards remain active.

**Verification order (do all that apply, in this order):**
1. **Current user direction** — Amber's latest explicit approvals and corrections govern voice.
2. **Existing local docs** — `docs/GOVERNANCE/internal_only/services/**` (incl. GlossGenius import CSVs), `docs/GOVERNANCE/internal_only/research/**`
   (treatment briefs + `_pricing-catalog.md`, `_gaps.md`).
   `docs/GOVERNANCE/internal_only/START-HERE.md` is the "which folder has the real answer" map — start there if unsure.
3. **Compliance** — `docs/GOVERNANCE/internal_only/compliance/` (statute) + `docs/GOVERNANCE/internal_only/compliance/COMPLIANCE-COPY-RULES.md`
   (claims). Statute wins over voice everywhere they touch.
4. **Notion** — the House of Rose HQ workspace (service pages carry `Competitor Pricing`, `Pricing
   Notes`, protocol, and provider fields). Search + fetch the specific page.
5. **Confirm with research** — the clinical/manufacturer/market fact (protocol, comp price, label
   claim). If no comp/source exists locally or in Notion, **research the web for our area** and cite it.
6. **Stylesheet / visual system** — Creative System **Visual Standards** for palette,
   typography, logo treatment, photography and the visual blacklist; `packages/web/src/styles/global.css`
   + `tailwind.config` for how that is actually implemented in the site.

**Then:**
- **Cite the source** for any number/claim I set (which doc/Notion page/URL it came from).
- **Do NOT normalize across everything. This is the #1 recurring failure.** Different services, providers,
  and platforms legitimately differ — and that difference is usually *correct*, not drift to be "fixed":
  - **By protocol:** Procell = series of **4** (manufacturer min 4, 6+ scarring); BioRePeel = **4** (mfr 4–6);
    Glo2Facial = **3/6**; microneedling = **3–6**. Series length is per-treatment, never one house count.
  - **By provider lane:** the *same treatment* can have *different models* per provider. BioRePeel = **add-on
    only** for Amber (advanced lane, +$65 onto microchanneling) but a **standalone** for Brandy (facials &
    peels lane). Two primary models, both correct. Always ask "whose lane?" before assuming one model.
  - **By platform:** GlossGenius (commerce truth) ≠ Sanity (display) ≠ local docs (staging) ≠ Notion (HQ).
    They are *allowed* to differ; reconcile toward the right source-of-truth per the truth rule, don't
    flatten them to look identical.
  Before "fixing" an inconsistency, find out **why** it exists. If I can't explain the why, I don't change it.
- **Don't treat stale/retired material as current, and don't preserve it "for reference."** Two things
  are permanently dead unless Amber explicitly revives them: **memberships** (no memberships of any kind)
  and **invented/flowery "signature" service names** (use plain technical names only). Also dead: any
  "special/discount" framing. If I find any of these in a doc, **delete it — don't annotate it**, because
  a note that names the dead thing just gets referenced and reintroduced. Historical artifacts are not
  the menu; the live menu is `docs/GOVERNANCE/internal_only/services/ALL-SERVICES-PRICING.MD` + GlossGenius + Notion.
- **When I find something actually incorrect** (drift, a stale price, a wrong name, a dead concept treated
  as live, a provider-lane error), **clean it up** — correct it, cite the fix, flag the conflict — rather
  than leaving it or silently overwriting the reason it existed.
- Where sources genuinely disagree and it's a real business call, **surface it and ask** — don't pick
  one and steamroll.

_Origin: 2026-07-17 — repeated failure across one session: (1) changed Procell series to fit a pattern
without checking why 4 existed (Procell protocol); (2) invented a BioRePeel "standalone vs add-on"
conflict that was really an Amber-vs-Brandy provider split; (3) surfaced dead botanical names +
memberships as if live. Core issue = **forcing one canonical pattern onto everything instead of letting
provider / protocol / platform differences stand.** Don't repeat this._

---

## 📕 Creative System — archival voice reference during reset

**`docs/GOVERNANCE/House_of_Rose_Creative_System/House_of_Rose_Creative_System_MASTER.md`** is retained
for verified business facts, compliance boundaries, provider credentials, consent requirements, NAP,
and the still-approved visual standards. Its positioning, personality, prose, biographies, copy
templates, taglines, campaign language, and strategy are `[SUPERSEDED]`. They do not govern new public
copy and must not be used as evidence of Amber's taste.

| What I need | Book (headings in `MASTER.md`) |
|---|---|
| Prior positioning, promise, audiences, and vocabulary | **1 — archival; do not use as a tonal model** |
| Prior voice profile, writing rules, CTAs, and templates | **2 — archival; do not use as a tonal model** |
| Historical business facts and prior public copy | **3 — verify facts against current owner documents; copy is archival** |
| Photography, video, color palette, typography, logo, before/after documentation, **visual blacklist** | **4 — Visual Standards** |
| Prior context blocks and writing prompts | **5 — archival; truth boundaries remain active** |
| Platform facts, SEO architecture, and measurement | **6 — facts only; prior campaign voice/strategy is archival** |
| Factual, clinical, visual, and platform review | **7 — voice criteria are archival** |

**Current reset rules also recorded historically in the archive:**
- **Category language = "Medical Aesthetics Practice."** This is the lead public descriptor — website,
  bios, ads, staff language, and AI instructions. `Medical spa` stays the **GBP platform category** and
  is fine in meta/SEO/supporting copy; we never deny being one, we just never lead with it. This
  supersedes the earlier "lead with advanced aesthetics & wellness studio" rule; the local shipping-
  source sweep is complete, while Sanity and external channels still require source-level review.
- **The prior signature line is `[SUPERSEDED]`.** Do not publish or teach it as canonical during the reset.
- **Retired language** — never as pillars, hooks, or default AI language: luxury / luxe /
  premium as self-description, **boutique** as category language, **glow / glowing / glow from within**,
  **radiance / radiant**, timeless beauty, flawless, ageless, **pamper**, **indulge**, treat yourself,
  reveal your beauty, best version of yourself, anti-aging miracle, turn back time, instant
  transformation, **pain-free**, **"no downtime"** (unless factually true for that exact procedure *and*
  clinically reviewed), **guaranteed results**.
- **Controlled-use language** — only when accurate, necessary, and not repeated: skin rejuvenation,
  evidence-based, advanced, personalized, customized, restore/restorative, confidence.
- **AI is a creative collaborator:** it should originate concepts, hooks, names, narratives,
  metaphors, campaigns, scripts, layouts, and art direction. Its boundary is truth, not imagination. It
  may not present invented business or clinical facts, credentials, reviews, patient evidence, or outcomes
  as real, or make a clinical decision.
- **Use review notes only when relevant:** flag unresolved factual assertions, new or materially
  changed clinical claims, fictional concepts, or missing assets. Do not force four boilerplate labels onto
  every creative draft.
- **Run factual, clinical, visual, and platform preflight before anything publishes.** Skip the
  superseded voice and positioning tests.

**Where current authority lives:**
- **Statute.** `docs/GOVERNANCE/internal_only/compliance/` wins wherever it touches (§ 456.062 disclosure, license
  type beside a practitioner's name, DKI / creative-enhancement bans).
- **Operational fact.** Pricing, series counts, provider lanes, and service names live in
  `docs/GOVERNANCE/internal_only/**` + GlossGenius + Notion, per the Verification order above.
- **Runtime NAP.** Sanity `siteSettings` remains the build-time source. Address, phone, hours, and
  service areas were verified 2026-08-01. The archive's five-category GBP stack is stale: only three
  categories were live when checked; the exact current list appears below.
- Architecture, repo layout, and checkout law further down this file.

**Open items — Amber's call, do not silently pick one:**
1. 🛑 **§ 456.062 — the archived Q3 campaign kit cannot publish as written.** Several internal campaign
   assets still advertise a **"complimentary"** consultation without an approved disclosure in the ad
   unit. The current `/skin-analysis/` route no longer uses that offer. Keep the archived campaign paused;
   either remove the offer during a future approved rewrite or obtain exact disclosure copy plus counsel
   sign-off. **Never improvise the statutory text.**
2. **GBP category expansion requires a new live-profile check and Amber's decision.** The last verified
   stack has **3** categories (`Medical spa` primary, `Facial spa`, `Skin care clinic`). Do not call
   absent categories "missing" or add them from an SEO task. `Waxing hair removal service` may be
   evaluated because waxing is current; `Massage spa` is unsupported because massage is not offered.
3. **Published Sanity copy carries 68 retired-term instances across 23 service docs**, and seven service
   **names break the naming law** (`Luxury Facial`, `Royal Rose Facial`, `Luxe Rose Facial`,
   `Signature Rose Facial`, `Signature Facial`, `Lunch Time Glow`, `Glowtox Facial`). Three of those
   **slugs are URLs** (`/services/luxury-facial/`, `/lunch-time-glow/`, `/glowtox-facial/`) — renaming
   needs a 301 plan and costs existing ranking. The 9 `no downtime` instances need **clinical review per
   service**, not a copy edit. Sized and itemized in `docs/DRIFT-CLEANUP-CHECKLIST.md` (P1).

**Closed 2026-08-01 — verified, do not re-open:**
- ~~Lead-descriptor sweep~~ — **done.** Governing docs, shipping source, campaign kit, and internal briefs
  all lead with `Medical Aesthetics Practice`. Sanity verified clean (descriptor never present there).
  "Private" was removed alongside it because it was inaccurate.

**Closed 2026-08-01 — verified against the live Google Business Profile, do not re-open:**
- ~~GBP description conflict~~ — **false alarm.** `docs/GOOGLE-BUSINESS-PROFILE.md` §3, Creative System
  Book 3 §3, and the live Google description are **byte-identical (731 chars)**. An earlier note claimed
  they disagreed; the two had never actually been compared.
- ~~Opening date June 15 vs July 9~~ — **settled: June 15, 2026**, which is what Google shows live.
  Any "July 9, 2026" reference is dead drift (already grep-banned in the drift checklist).
- ~~Google chat not configured~~ — **not a config gap.** Google discontinued Business Profile chat
  entirely on 2024-07-31; there is nothing to connect. See `docs/GOOGLE-BUSINESS-PROFILE.md` §2.

---

## Business
House of Rose is a medical aesthetics practice in Punta Gorda, Florida.
This is a **completely separate business from FAS Motorsports** — no shared infrastructure, no Medusa, no Vendure.

---

## Visit Policy (operational fact, not recurring marketing copy)
House of Rose currently takes walk-ins. Keep that fact accurate when a customer directly asks about
availability, in the relevant visit FAQ, and in platform settings. It is not a brand pillar, slogan,
differentiator, or required line of copy.
- **Waxing and facials:** walk-ins always accepted.
- **Everything else (including Botox/injectables, IV, body treatments, etc.):** walk-ins accepted
  whenever there is time on the schedule.
- Appointments remain the recommended path. Never claim "by appointment only" or "no walk-ins" while
  the current policy is active.
- Do not add walk-in language to heroes, footers, service pages, bios, ads, schema descriptions, general
  CTAs, or AI-feed boilerplate. One direct FAQ answer plus accurate GBP/platform settings is enough.

🔭 **Known future change:** Amber has said the walk-in posture will tighten once the client base is
consistent (noted 2026-08-01). When that happens, update the GBP planning attribute, the direct visit FAQ,
this policy block, and the drift guard together.

---

## Public-Facing Copy Law (binding — 2026-07-24)
_These repo-specific rules remain binding during the voice reset. The superseded Creative System
Book 2 is not a tonal standard and must not be read as one._
- **Internal provider lanes stay internal; verified provider attribution does not.** Do not explain
  staffing, compensation, room-rental arrangements, or “Amber's lane / Diana's lane / Brandy's lane”
  to customers, and do not invent provider ownership of a service. But when a verified provider is
  responsible for a service, naming that person with the required licence type is useful trust evidence
  and is encouraged on the service page, provider profile, booking UI, and related decision-support copy.
  Say what the person provides; do not narrate the internal reason the menu is organized that way.
- **Service descriptions must inform without performing a sales script.** Establish the observable concern
  or the service's verified role early, but do not force every description to open with the same declarative
  formula. A human observation, concrete practice detail, or useful client question may lead when it reaches
  the distinction just as clearly. Include enough verified context to make that distinction meaningful; do
  not reduce the page to an inventory line and a disclaimer. Do not default to outcome promises,
  emotional-benefit language, or a protocol recital. Also avoid stacking "may possibly," "could potentially,"
  and repeated variance disclaimers until useful information disappears. Specific, direct decision support
  is the standard.
- **Do not confuse restraint with removal.** The reset rejects robotic phrasing, unsupported claims,
  repetition, and generic filler; it does not reject depth, warmth, persuasion, or treatment education.
  A longer section is appropriate when it teaches a meaningful distinction, shows real proof, answers a
  question a client actually has, or gives a specific reason to trust House of Rose. When stale CMS prose
  is withheld, treat that as a temporary safety measure and replace its useful substance with reviewed copy.

---

## Florida Advertising Law (binding — 2026-07-26) — `docs/GOVERNANCE/internal_only/compliance/`
Marketing for this business is regulated. **`docs/GOVERNANCE/internal_only/compliance/` is the binding statutory layer** and is
inherited by every copy, ad, offer, pricing, or credential task. `docs/GOVERNANCE/internal_only/compliance/COMPLIANCE-COPY-RULES.md`
covers voice and claims; `docs/GOVERNANCE/internal_only/compliance/` covers what the law requires. **Where they conflict,
`docs/GOVERNANCE/internal_only/compliance/` wins.** Read `docs/GOVERNANCE/internal_only/compliance/README.md` before publishing any offer, price,
provider name, or paid ad. The four rules that get broken most:

- **§ 456.062 72-hour disclosure** — required, verbatim and in caps, on any surface advertising a
  **free, discounted, or credited** service. "Complimentary" triggers it. Required **in the ad unit
  itself**, not just the landing page — if a format can't carry the block, keep the offer out of that
  format. Never paraphrase, shorten, sentence-case, or hide it behind a toggle. The former legal-analysis
  draft was intentionally removed on 2026-07-27; obtain approved exact disclosure copy before publishing.
- **License type wherever a practitioner is named** — § 456.072(1)(t). **MD / DO / APRN / RN.**
  "Aesthetic Injector," "Injector," "Provider," "Skin Specialist" are job titles and satisfy nothing.
  Separate from the internal-lane rule above: legal attribution is required, lane commentary is not.
- **Never write "dermatologist," "skin doctor," or "dermatology specialists" in copy** — implies a
  specialty not held (R. 64B8-11.001(2)(k)). Bidding the keyword is fine; the word in copy is not.
- **Disable anything that can rewrite published text** — Google DKI + automatically created assets,
  Meta creative enhancements + text variations. An optimiser that rewrites a paragraph can delete a
  statutory disclosure, and "the platform generated it" is not a defence (R. 64B8-11.001(5)).

**Structure (verified 2026-07-26 against Sunbiz + Amber):** **HOUSE OF ROSE AESTHETICS LLC**, doc
**L26000204660**. Authorized members: **Amber Mingione** (licensed esthetician) and **Diana Morrison,
RN**. Medical director assigned through Guardian Medical Direction — **Joshua Shaw, MD · FL Lic. ME136232** (verified against the CMS NPI Registry). He is the
named responsible provider for ad attribution and carries the R. 64B8-11.001(5) risk. **Canonical
attribution line: `Medical Director: Joshua Shaw, MD · FL Lic. ME136232`.**

⚠️ **Two things never to imply about him.** His NPI taxonomy is **Surgery** — so nothing may imply he
is a dermatologist or any specialist (R. 64B8-11.001(2)(k) is violated by implication alone). And he
provides **oversight and protocol supervision, not treatment** — nothing may imply he performs
treatments or is on site (R. 64B8-11.001(2)(a)). If his photo is used, label the role explicitly.
🚫 **Never record or transmit a DEA number** — no advertising purpose, and a fraud vector. § 464.0123 limits APRN **autonomous** practice to primary care — aesthetics is
not primary care — so aesthetics runs on a **§ 464.012(3) written physician protocol**. An APRN *may*
perform aesthetics under that protocol; she may not do it autonomously. **Confirm the protocol covers a
service before advertising it.**

🟡 **AHCA clinic licensure — open, but narrow.** House of Rose is a **cash-pay aesthetic practice** under
physician medical direction and almost certainly falls **outside** the § 400.9905(4) definition of
"clinic," which requires an entity that "tenders charges for reimbursement." That is the mainstream
position and very likely correct. It is worth one written counsel opinion rather than an assumption,
because **no exemption sits behind it**: (4)(g)'s closed list omits ch. 477 (esthetician) entirely and
reaches nursing only through `s. 464.012` (**APRN** — Diana is a plain RN), and (4)(f) needs a physician
*owner*, which a contracted medical director is not. **This is unrelated to the DBPR salon licence,
county approvals and inspections the practice already holds — AHCA is a different regulator.** Anything
billed to insurance or a third-party payer would change the analysis; watch GLP-1. Do not reason from
§ 456.001(4)'s general definition; § 400.9905 never cites it. The supporting legal-analysis draft was
intentionally removed on 2026-07-27; confirm this posture with Florida healthcare counsel.

⚠️ **Diana is an RN, not an APRN.** § 464.0123 autonomous practice does not apply to her — the operative
question for RN-performed injectables is **physician delegation and supervision**. Her advertising
credential is **"Diana Morrison, RN"** (§ 456.072(1)(t)).

⚠️ **The certificate of exemption is voluntary and expensive in a non-obvious way:** § 400.9935(6) makes
publishing a fee schedule a **condition precedent** — uninsured cash prices for the 50 most-frequent
services, posted in the reception area on a sign of **at least 15 square feet**. That collides directly
with the pricing-confidentiality decision. Confirm the current requirement with Florida healthcare counsel.

---

## Canonical Business Facts (NAP — never drift; source of truth = Sanity `siteSettings`)
- **Name:** House of Rose Aesthetics
- **Address:** 525 E Olympia Ave, Unit 9, Punta Gorda, FL 33950 — _"Unit 9" (never Ste/Suite); ZIP 33950 (never 33982)_
- **Phone:** (844) 941-7673 — spells **ROSE**; E.164 `+18449417673`; **never `7376`**
- **Email:** info@houseofrosefl.com (primary) · book@houseofrosefl.com (**live alias** → routes to primary; confirmed with Amber 2026-08-01) — _use `info@` in public NAP, GBP, schema, and footer; `book@` is valid only as the booking/`mailto:` destination (`PUBLIC_BOOKING_EMAIL`). Supersedes the earlier "`book@` was never a real address" rule — that is now **false**, do not act on it or re-remove `book@` from env files or booking links._
- **Hours:** Mon–Fri 9:00 AM–5:00 PM · Sat–Sun closed. **Pickup hours are the same** (Mon–Fri 9–5); Sat/Sun pickup not set.
- **Web/social:** https://houseofrosefl.com/ · IG `house.of.rose.aesthetics` · FB `https://www.facebook.com/hofraesthetics` · **opened June 15, 2026** _(confirmed 2026-08-01 against the live Google Business Profile — this settles the June 15 vs July 9 question; **June 15 is correct**, July 9 is dead.)_
- **Ownership attributes (live on GBP):** Women-owned · Latino-owned. Full attribute inventory (accessibility, amenities, crowd, parking, payments) lives in `docs/GOOGLE-BUSINESS-PROFILE.md` §5 — verified accurate 2026-08-01.
- **Service area:** Punta Gorda · Port Charlotte · Charlotte Harbor · Babcock Ranch · Burnt Store Marina · Punta Gorda Isles
- **GBP categories — 3 live, verified 2026-08-01:** Primary `Medical spa`; secondary `Facial spa`, `Skin care clinic`. Other categories are proposals until a new profile check and owner decision; see `docs/GOOGLE-BUSINESS-PROFILE.md`. Do not cite a five-category stack.
- **GBP services link:** https://houseofrose.glossgenius.com/services
- **GBP primary category:** `Medical spa`. **Med-spa positioning is ON — "allow, don't lead":** "med spa / medical spa" is permitted in meta, GBP, SEO, and supporting copy where it aids discovery, and we **never deny being a med spa**. Still avoid "day spa" (undersells). **The lead prose descriptor is `Medical Aesthetics Practice`** under the current voice-reset rules — _not_ "advanced aesthetics & wellness studio", which is supporting/SEO language only.
- **Phone SMS:** not enabled while Grasshopper verification is pending. Do not invite customers to text until activation is confirmed.
- **GBP CTA:** call; no appointment requirement. The GlossGenius URL is the GBP menu/services link, not the primary booking-button CTA.

## Providers & Team (memory — never re-ask)
- **Amber** — esthetician + RN assistant. Lane: **Advanced Facials** (Microneedling with the Procell Therapies device, Glo2Facial, PRF topical, Procell MD/Pro materials, BioRePeel, dermaplaning, carboxy). Use **Procell Microchanneling** only in explicit Procell context; it is not a separate service from Microneedling. PRF **topical only, no injections**. **BioRePeel for Amber is an ADD-ON ONLY (+$65) to an advanced service such as Microneedling — she does NOT do standalone BioRePeel.** Standalone BioRePeel is Brandy's.
- **Diana** (RN) — Lane: **Injectables** (tox/filler/PRF injections), **IV Hydration**, and the **GLP-1** program.
- **Brandy** — Lane: **Basic Facials & Peels** (relaxing/maintenance: enzyme exfoliation, hydrodermabrasion, light peels) plus **facial waxing**. Rents a room. **Brandy owns STANDALONE BioRePeel** (facial + standalone series of 4) — the standalone peel is hers, not Amber's.
- **Aundrea** — **Professional makeup artistry and permanent jewelry** (weddings, special events, photoshoots, and celebrations). These are non-medical services. Public provider copy was restored by Amber on 2026-08-06.

⚠️ **Ownership structure ("Co-Owner") is PRIVATE — never public-facing (binding — 2026-08-13).** Amber and Diana
are both authorized LLC members per Sunbiz (see Florida Advertising Law section above), but that fact must never
appear in customer-facing copy: not in `publicRole`/title strings, bios, meta descriptions, tap-to-share cards
(`/amber`, `/diana`), the homepage team section, or `/about` copy. If you find "Co-Owner"/"Owner" in any
customer-facing surface (including a seed script that could regenerate it), remove it — don't just fix the live
page and leave the source it came from. Swept clean 2026-08-13: `aboutFallbacks.ts`, `amber.astro`, `diana.astro`,
homepage, `about/index.astro`, and `studio/scripts/seed-about-providers.mjs`.

## Memberships — NOT OFFERED
House of Rose does **not** offer memberships. None exist, none are in the site or Studio, none are
planned. `/memberships/*`, `/rose-circle/*`, and `/plans/*` all return forced `404` responses so
search engines remove the historical URLs. **Never add membership UI,
schema, tiers, or "member rate" framing anywhere.** (GLP-1 is a normal **service** — Diana — not a
membership.)

- **Naming law:** service names are **plain, technical, searchable only** — no invented, flowery, or
  "signature" names, and no membership-style program names.

## Checkout — Stripe Elements + Shippo (see `docs/CHECKOUT.md`, binding)
- **TEMPORARILY HIDDEN (2026-08-11):** the public shop, cart, checkout entry point, merchant feed,
  and shop sitemap links are off unless `PUBLIC_SHOP_ENABLED=true` at build time. Netlify also forces
  `/shop/*` and `/checkout/*` to 404; remove those temporary rules when the shop is restored. The shop
  source, Sanity schemas, products, and checkout functions remain intact.
- **GlossGenius CANNOT sell products online** (no online store — their docs say so). It is
  booking + in-person POS only. It is **not** the checkout. Retail runs on **Stripe Elements
  + Shippo** on our own `/checkout` page, with **Sanity as the price source of truth**.
- **The browser never names a price.** It sends `{productId, quantity}`; the server re-reads
  prices from Sanity and the shipping rate from Shippo. No Stripe Product/Price mirror exists.
- **Live shipping rates**, not a zone table: the Address Element drives a real Shippo quote.
  Hosted Stripe Checkout can't do this (static `shipping_options`) — that's why we use Elements.
- **Never `return Astro.redirect()` from a prerendered page** — it stops Astro emitting the
  sibling index chunk and breaks the build (`Cannot find module dist/pages/shop.astro.mjs`).
- **Emails via Resend**: confirmation on payment (`stripe-webhook`), tracking when Amber marks
  the order `shipped` in the Studio (Sanity webhook → `order-shipped`).
- **Labels are NEVER auto-bought.** Payment does not spend postage — a chargeback would cost us
  the goods AND the label, stock can be stale, addresses can be typo'd, weights can be wrong.
  Amber ticks `buyLabel` on a paid order → `buy-label.ts` (idempotent; re-quotes if the Shippo
  rate expired; records real `labelCost` vs what the client paid).
- **The cart is cleared on `/order-confirmed/`**, never after `confirmPayment()` (that redirects
  away, so code after it never runs — the customer would return to a full cart).
- **Weights are in POUNDS** (`weightLb`, Shippo `mass_unit: 'lb'`) — never ounces. Set it on
  heavy products or shipping under-charges. `purchaseUrl` is now the escape hatch, not the
  default. Orders land in Sanity as `order` docs; check `fulfillmentError`.

## URL rule — trailing slash REQUIRED on inner pages
Astro's default `build.format` is `directory` and `site` resolves to `https://houseofrosefl.com/`, so every inner page lives at its **trailing-slash** URL (`/services/`, `/experience/`, `/services/prf/`, `/privacy-policy/`). Writing an inner-page URL **without** the slash relies on a redirect and can break — the same failure seen on FAS Motorsports. Root domain (`houseofrosefl.com`) is slash-optional. **Rule: every absolute or internal link to an inner page ends in `/`.**

---

## Repo: house-of-rose-site
**Monorepo** at `~/LocalStorm/Workspace/DevProjects/GitHub/house-of-rose-site/`

| Package | Path | Purpose |
|---------|------|---------|
| `@house-of-rose/web` | `packages/web/` | Astro static site — customer-facing storefront |
| `@house-of-rose/studio` | `packages/studio/` | Sanity Studio v3 — content & product management |

---

## Architecture Law (Never Break)
- **Sanity owns the source records**: services, products, site settings, content, images. During the
  voice reset, a renderer may temporarily withhold unreviewed prose without changing the Sanity record.
- **No Medusa** — this is a spa, not a high-volume e-commerce store
- **No Vendure** — unrelated to FAS Motorsports ecosystem
- **Astro is static (`output: 'static'`)** — all data fetched at build time via GROQ
- **No React islands for now** — pure Astro components unless interactivity is explicitly needed

---

## Sanity Project
| Key | Value |
|-----|-------|
| Project ID | `4e7axyi7` |
| Dataset | `production` |
| API Version | `2025-04-26` |
| Studio URL (local) | `http://localhost:3333` |
| Studio URL (production) | `https://studio.houseofrosefl.com` |
| Organization | Amber (`ouLdbVxnh`) |

**CORS origins registered on project 4e7axyi7:**
- `http://localhost:3000` (auto-added at project creation)
- `http://localhost:3333` (local Studio dev server)
- `https://studio.houseofrosefl.com` (production Studio)

---

## Tech Stack
- **Framework**: Astro v5 (static output)
- **Styling**: Tailwind CSS v3 + `@tailwindcss/typography`
- **CMS**: Sanity v3 + GROQ
- **Language**: TypeScript (strict, no `any`)
- **Hosting**: Netlify — storefront at `houseofrosefl.com`, Studio at `studio.houseofrosefl.com`
- **Visual editing**: Netlify Visual Editor (Stackbit) over Sanity — see below

---

## Visual Editing (Netlify Visual Editor)
Click-to-edit / side-by-side editing sits **on top of** Sanity — **not** a second CMS,
and Astro stays `output: 'static'`. Full runbook: `docs/VISUAL-EDITING.md`.

- **Config**: `stackbit.config.ts` (repo root) — Sanity content source + `PAGE_ROUTES`
  map (keep in sync with the Routes table below) + Astro `custom` SSG dev command.
- **Dev deps only**: `@stackbit/cli`, `@stackbit/cms-sanity`, `@stackbit/types`
  (never imported by site code — production build untouched).
- **Run locally**: `npm run dev:visual` (editor on `:3000`; Astro preview on a
  Stackbit-assigned port injected via the `{PORT}` placeholder in `devCommand`).
  The editor origin `http://localhost:3000` is already in the Sanity CORS list —
  don't pass `--port` to `stackbit dev` (it moves the editor off that origin and
  breaks Sanity reads/writes via CORS).
- **Env** (add to `.env.local`, auto-loaded by `stackbit.config.ts`):
  `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_STUDIO_URL`, `SANITY_ACCESS_TOKEN`
  (Editor token, read+write, for two-way sync).
- **Inline edit**: all Sanity-backed pages + shared components are annotated via
  `packages/web/src/lib/visualEditing.ts` (`data-sb-*` helpers). Arrays use the
  numeric **index** (`faqs.0.question`), refs are rescoped with their own `_id`.
- **Automation** (`scripts/visual-editing/`): `npm run ve:check` (coverage gate),
  `ve:sync` (PAGE_ROUTES drift), `ve:new` (scaffold pre-annotated page/component +
  auto-register route). A `prepare`-installed pre-commit hook blocks un-annotated
  Sanity-backed files. Allow-list lives in `check-coverage.mjs`.
- **Formerly-hardcoded pages now Sanity-backed singletons** (deployed + seeded):
  `homepage`, `contactPage`, `supportPage`, `privacyPolicy`, `termsOfService`, `rentARoom`, `skinAnalysis`, `thankYou` — each
  edited under Studio → **Pages** (or **Home Page**). During the voice reset, local renderers may
  withhold unreviewed prose; only Sanity content that is actually rendered remains click-to-edit.
  Forms (contact, rent-a-room) and JSON-LD remain untouched.
  _(The `roseCirclePage` and `membershipsPage` singletons were deleted in the 2026-07-07 membership teardown.)_

---

## Netlify Sites

| Site | Netlify Name | Site ID | Custom Domain | Config |
|------|-------------|---------|---------------|--------|
| Storefront | `house-of-rose-web` | `0de4617d-5ba1-4e80-b59e-4900b540f5c0` | `houseofrosefl.com` | Base dir: `packages/web` → uses `packages/web/netlify.toml` |
| Studio | `house-of-rose-studio` | `44c4d348-8afd-4c0d-adb2-f8f9b7ffde15` | `studio.houseofrosefl.com` | No base dir → uses root `netlify.toml` |

**Netlify env vars set on `house-of-rose-web` (builds scope):**
- `PUBLIC_SANITY_PROJECT_ID` = `4e7axyi7`
- `PUBLIC_SANITY_DATASET` = `production`
- `PUBLIC_SANITY_API_VERSION` = `2025-04-26`
- `SANITY_API_WRITE_TOKEN` = (secret — server-side lead submission writes, do not commit)
- `PUBLIC_SITE_URL` = `https://houseofrosefl.com/`
- `PUBLIC_BOOKING_EMAIL` = `book@houseofrosefl.com` (live alias; rental/booking `mailto:` only)
- `PUBLIC_GTM_ID` = `GTM-NSDKJFP9` (browser-safe; builds + functions; served through `/metrics/`)
- `PUBLIC_MAPBOX_ACCESS_TOKEN` = browser-safe public token (production value is URL-restricted to `houseofrosefl.com`)

**Netlify UI configuration:**
- **Studio site**: No base directory needed (uses root `netlify.toml`)
- **Web site**: Must set Base directory to `packages/web` in Site settings → Build & deploy → Base directory
- Both sites: Connect GitHub repo (`house-of-rose-site`) and configure custom domains

---

## Schemas (packages/studio/schemas/)
| Schema | Description |
|--------|-------------|
| `siteSettings` | Singleton — site name, tagline, contact, social |
| `serviceCollection` | Groups of related services (e.g. "Facials", "Body") |
| `service` | Individual treatment — title, duration, price, image |
| `product` | Retail product — skincare, candles, gift cards. Includes `purchaseUrl` (external checkout link), `ctaLabel` (free-text shop button copy), `badge` (ribbon tag), `isFeatured` (Top Sellers rail) |
| `promotion` | Shop sale/promo banner — editorial headline/teaser/CTA, links internal (promo page, product, or `/shop#brand` anchor) or external (checkout). Active/date-window controlled |
| `shopBrand` | Retail brand storefront copy (Procell, GlyMed+, Skin Script, Face Reality, House of Rose) — story, logo, hero image, CTA. Distinct from `brandProfile` (House of Rose's own brand-voice/strategy doc) |

---

## Routes (packages/web/src/pages/)
| Route | File | Data Source |
|-------|------|-------------|
| `/` | `index.astro` | All services + collections |
| `/services` | `services/index.astro` | All services |
| `/services/[slug]` | `services/[slug].astro` | Single service by slug |
| `/services/collections` | `services/collections/index.astro` | All collections |
| `/services/collections/[collection]` | `services/collections/[collection].astro` | Single collection |
| `/shop/jane-iredale` | `shop/jane-iredale.astro` | Jane Iredale product feature singleton (`janeIredalePage`) — makeup/skincare/supplements, benefits, post-treatment use, this-for-that swap guide, Get-the-Look. |
| `/experience` | `experience.astro` | Static |
| `/about` | `about/index.astro` | About index singleton (`aboutPage`) |
| `/about/hra` | `about/hra.astro` | Practice story from the `aboutPage` singleton |
| `/about/providers` | `about/providers/index.astro` | Public provider directory (`provider`) |
| `/about/providers/[slug]` | `about/providers/[slug].astro` | Public provider profile (`provider`; `Person` JSON-LD) |
| `/cost/[slug]` | `cost/[slug].astro` | Cost guide by slug (`costGuide`) |
| `/compare/[slug]` | `compare/[slug].astro` | Comparison by slug (`comparison`) |
| `/areas` · `/areas/[slug]` | `areas/...` | Local authority pages (`localArea`) |
| `/results` · `/results/[slug]` | `results/...` | Before/after proof (`caseStudy`) |
| `/faq` | `faq.astro` | Aggregated FAQ hub (FAQPage JSON-LD) |
| `/support` | `support.astro` | Customer support singleton (`supportPage`) — appointments, booking, contact options, and support FAQs (FAQPage JSON-LD) |
| `/terms-of-service` | `terms-of-service.astro` | Legal terms singleton (`termsOfService`) — website use, appointments, communications, and online product orders (WebPage JSON-LD) |
| `/shop` | `shop.astro` | Product catalog — promotions (`promotion`), category filter, top sellers, brand-grouped grid (`shopBrand` + `product`). See `docs/SHOP-ARCHITECTURE.md`. |
| `/shop/[slug]` | `shop/[slug].astro` | Single product detail page (`product`) — checkout CTA when `purchaseUrl` is set, related products from the same brand. `Product` JSON-LD. |
| `/amber` | `amber.astro` | Static — Amber's tap-to-share digital business card (self-contained black/gold card, no Header/Footer, `Person` JSON-LD; downloads `public/amber.vcf`) |
| `/diana` | `diana.astro` | Static — Diana Morrison, RN tap-to-share card (mirrors `/amber/`; `Person` JSON-LD; downloads `public/diana.vcf`) |
| `/brandy` | `brandy.astro` | Static — Brandy's tap-to-share card (mirrors `/amber/`; `Person` JSON-LD; downloads `public/brandy.vcf`) |

---

## Marketing / SEO / AEO Infrastructure

This site is engineered for **Answer Engine Optimization** (AI Overviews, ChatGPT/Perplexity) +
local authority — see `docs/SEO-AEO-PLAYBOOK.md` and `docs/CONTENT-MODEL-MAP.md`. These are
**binding** and inherited by every content task (also referenced from `AGENTS.md`).

**Layering during the reset:** `SEO-AEO-PLAYBOOK.md` owns the page-type framework and publish
checklist. `CONTENT-MODEL-MAP.md` owns the wiring (doc type → route → JSON-LD → GROQ). Current user
direction governs positioning and voice. Creative System Book 6 may be consulted only as an archival
lead to platform facts and measurement definitions, which must be reverified against current owner
documents; its strategy and Book 2 voice rules are archival.

- **7 canonical page types**: Service, Cost guide, FAQ, Comparison, Local area, Before/after, Process.
- **Every new intent-led treatment/SEO page ships JSON-LD** via `src/lib/structuredData.ts` (typed builders — never inline).
- **AEO content rules**: make the page purpose and main answer clear early, keep entities explicit,
  ground local facts accurately (Punta Gorda / Charlotte County / SW FL), use honest pricing, avoid
  medical overclaiming, and create no orphan pages. Clarity is required; a repeated answer-first or
  question-heading formula is not.
- **AEO doc types**: `costGuide`, `comparison`, `localArea`, `caseStudy` (+ shared `seo`, `faq`
  objects). Canonical NAP lives in `siteSettings`, mirrored in `structuredData.ts` (`LOCAL_BUSINESS`).

### Site Elevation Prompt Pack
`docs/GOVERNANCE/internal_only/prompts/site-elevation/` is a historical implementation pack. Its
writing, CTA, journey, and Sanity-seeding prompts predate the voice reset and must not be run as current
instructions. It may be consulted only for task inventory or architecture after checking current rules.
Research briefs live in `docs/GOVERNANCE/internal_only/research/`; source-of-truth for treatment
facts/pricing is `docs/GOVERNANCE/internal_only/services/**`.

---

## Local Dev
```zsh
# Install (run from repo root)
npm install

# Astro frontend
npm run dev:web        # → http://localhost:4321

# Sanity Studio
npm run dev:studio     # → http://localhost:3333

# Build both
npm run build
```

---

## Env Vars
Local: `packages/web/.env.local` (gitignored — already populated with Sanity tokens)
Production: set in Netlify dashboard

| Variable | Used By | Notes |
|----------|---------|-------|
| `PUBLIC_SANITY_PROJECT_ID` | web | `4e7axyi7` |
| `PUBLIC_SANITY_DATASET` | web | `production` |
| `PUBLIC_SANITY_API_VERSION` | web | `2025-04-26` |
| `SANITY_API_WRITE_TOKEN` | web functions | Server-only — creates lead submissions, never expose to browser |
| `PUBLIC_SITE_URL` | web | Canonical URL for meta/og |
| `PUBLIC_BOOKING_EMAIL` | web | Live `book@houseofrosefl.com` alias used only on rental/booking `mailto:` links |
| `PUBLIC_GTM_ID` | web + edge | `GTM-NSDKJFP9`; browser-safe container ID served through the first-party `/metrics/` gateway |
| `PUBLIC_MAPBOX_ACCESS_TOKEN` | web | Browser-safe `pk.` token for the contact map, address search, and directions; production token is URL-restricted |
| `PUBLIC_SHOP_ENABLED` | web | Opt-in storefront flag; unset/false keeps shop navigation, cart UI, product routes, sitemap entries, and Merchant Center items hidden |

---

## Git Push Protocol
Use Desktop Commander (`mcp__Desktop_Commander__start_process`) to run `git push` — it executes as `ambermin` with Keychain access.

```zsh
cd ~/LocalStorm/Workspace/DevProjects/GitHub/house-of-rose-site && git push origin main
```

---

## Preferences
- Strict TypeScript — no `any`, use interfaces + generics
- GROQ queries live in `packages/web/src/lib/queries.ts`
- Sanity client/helpers live in `packages/web/src/lib/sanity.ts`
- Create files in place — don't just output code blocks
- Explain the *why* and *how*, skip pleasantries

---

## Two-Menu Content Architecture (binding — 2026-07-24)
There are TWO separate service menus with DIFFERENT copy. Never sync them mechanically. During the
voice reset, neither menu may use the superseded Creative System voice or templates. The website can
carry fuller decision-supporting detail; GlossGenius remains concise and booking-focused. Verified
facts and compliance limits apply to both.

**Sanity = the customer-facing WEBSITE menu (houseofrosefl.com).**
- Clear, substantive decision support that helps a client understand the service without a sales script
  or a repeated answer-first template.
- Depth is proportional to the service: keep verified treatment facts, recovery, pricing, provider scope,
  and evidence; suppress stale promotional fields until their voice and claims are reviewed.
- SEO/AEO: keyword-optimized from real research (Semrush + Ahrefs, run with agents in parallel), local
  market comps (Punta Gorda / Charlotte County / SW FL), gap-filling vs local competitors, and internal
  interlinking across related services / concerns / cost / compare pages.
- Sanity fields remain the source records, but a renderer may temporarily withhold unreviewed tagline,
  description, whoItsFor, FAQ, process, or SEO prose during the voice reset.
- Publish only prices reconciled to the current GlossGenius menu; omit unresolved price structures.
  Internal staffing lanes remain private, while verified provider attribution may be public under the
  rule below.

**GlossGenius = the generic BOOKING menu (in-app booking/POS).**
- SIMPLE and SHORT. One factual blurb per service, UNDER 2000 characters (aim 2–4 direct sentences).
- State what the service is and the verified concern or category it addresses. Do not turn the booking menu
  into either a sales script or a miniature clinical protocol.
- NEVER include in a GlossGenius description: "provider lane"; "by [provider]" / any provider attribution
  or name; "category"; any price or dollar figure; "available in 3 or 6 sessions" / any series count;
  "discount"/"special"/"deal".
- Still compliant: no "cure," "guaranteed," "reverse aging," "stem cell," etc. (see COMPLIANCE-COPY-RULES.md).
- No GlossGenius API access — GlossGenius copy is produced as a paste-ready deliverable for Amber to enter.
