# M17 AI Skin Analysis — Team Cheat Sheet

> **Internal staff reference.** Amber · Diana · Brandy · Aundrea.
> Source of truth for the iPad tool at `/staff/skin-analysis/` and the printable room card.
> Prices track `docs/services/ALL-SERVICES-PRICING.MD`. Language tracks `docs/COMPLIANCE-COPY-RULES.md`.

---

## 0. The one rule that outranks everything

**The M17 analyzes the _appearance_ of skin. It does not diagnose anything.**

Never say the machine "found," "detected," or "diagnosed" a condition. It **scored** an
appearance indicator. Never say a treatment "treats," "cures," "clears," or "fixes" acne,
rosacea, melasma, or scarring — say it "supports the appearance of," "helps improve the look of,"
or "is designed to."

**Canonical closing line — say it out loud on every scan:**
> "Final treatment combinations and candidacy are confirmed by your licensed provider based on
> candidacy, contraindications, and local regulations. Not every client is a candidate for every
> service, and outcomes are individual."

---

## 1. How the machine actually works (so you sound like you know)

The M17 is a **20MP, 10-spectrum** imaging system. Each "spectrum" is a different light source that
reveals a different depth or property of the skin. The AI then scores **18 indicators**.

| Light / channel | What it physically sees | Indicators it drives |
|---|---|---|
| **RGB / normal light** | Surface, what the eye sees | Texture, Wrinkle, Acne, Pores |
| **Cross-polarized** | Cancels surface shine → sees *into* the skin | Dermis Pigment, Sensitive Area, Spider Vein, Redness |
| **Parallel-polarized** | Amplifies surface reflection | Texture, Pores, Sebum, Comedo |
| **UV (365nm)** | Fluorescence — bacteria + sun history | **Porphyrins**, UV Damage, Sebum, Clogged Pore |
| **Brown / woods-lamp band** | Melanin distribution | Epidermis Pigment, Brown Area, Melasma |
| **Red band** | Hemoglobin / vascularity | Sensitive Area, Spider Vein, Thermal map |
| **Multi-band composite** | AI model | Moisture, Collagen, Skin Age, Future Aging Simulation |

**The 20-second explainer to give the client:**
> "This isn't a photo filter — it's ten different light sources. Some read the surface, some see
> under it, and the UV light shows sun history and pore activity your eye can't see yet. In about
> three minutes we'll have eighteen scores, and we'll only talk about the three that matter for you."

---

## 2. The 18 indicators — what it is, what you SAY, what you BOOK

> **Scoring convention:** the M17 reports a 0–100 score per indicator plus a percentile vs. age group.
> **Lower score = more of that condition present.** Anything scoring in the bottom third is a talking point.
> Confirm your unit's polarity on the first few scans and note it here: `______`

### GROUP A — PORE & OIL (the acne/congestion lane)

| # | Indicator | What it actually is | ✅ Say this | ❌ Never say | Book → | Who |
|---|---|---|---|---|---|---|
| 1 | **Pores** | Visible follicular openings, enlarged by oil + laxity | "Your pores are reading larger through the T-zone — that's usually oil volume plus a little loss of firmness around the opening." | "We'll shrink your pores" | Procell Microchanneling — Pro **$250** · Glo2Facial **$195** | Amber |
| 2 | **Sebum** | Surface + follicular oil load (UV fluoresces oil) | "Your oil map is heaviest here. That's not a flaw — it's information about what your barrier is compensating for." | "You have oily skin, that's the problem" | Skin Reset Facial **$140** · Face Reality homecare | Brandy |
| 3 | **Comedo** | Closed/open comedones — the "grit" | "These are comedones — congestion that hasn't surfaced yet. This is the most treatable thing on your whole report." | "Blackheads we'll extract and they'll be gone" | Signature Facial **$120** · Skin Reset **$140** · Dermaplane prep **+$45** | Brandy / Amber |
| 4 | **Clogged Pore** | Impacted follicles, UV-visible | "You've got impaction showing under UV before it's visible in the mirror — this is why we scan first." | "Your pores are dirty" | Glo2Facial **$195** · Acne Bootcamp **$899** | Amber |
| 5 | **Porphyrins** ⭐ | **Fluorescing metabolic byproduct of _C. acnes_ bacteria in the follicle.** Glows under UV. | "Those bright dots under the UV light are porphyrins — a marker of bacterial activity inside the pore. It's the single best predictor of where your next breakout shows up." | "You have a bacterial infection" / "We'll kill the bacteria" | **Acne Bootcamp — 12 wk $899** · Face Reality homecare | Amber |

> **⭐ Porphyrins is your money slide.** Clients have never seen it, it looks dramatic, and it
> predicts future breakouts — which makes it the most honest, least pushy upsell on the machine.
> **Script:** *"Here's the thing about porphyrins — they show up before the breakout does. What
> you're looking at is next month's skin. That's the whole argument for doing this as a program
> instead of a one-off facial."* → Acne Bootcamp.

---

### GROUP B — PIGMENT & SUN (the brightening lane)

| # | Indicator | What it actually is | ✅ Say this | ❌ Never say | Book → | Who |
|---|---|---|---|---|---|---|
| 6 | **Epidermis Pigment** | Surface-level melanin clusters | "This is surface pigment — it sits shallow, which is good news. Shallow responds." | "We'll erase these spots" | BioRePeel · Procell MD **$349** · Skin Script homecare | Amber |
| 7 | **Dermis Pigment** | Deeper melanin — slower, stubborner | "This layer sits deeper. It's a longer conversation — I'd rather be honest with you now than oversell you." | "Same treatment, same timeline" | Procell MD series **3× $940 / 6× $1,675** | Amber |
| 8 | **Brown Area** | Total melanin distribution map | "This shows how evenly your tone is distributed. Evenness is what reads as 'glow' — more than brightness does." | "Your skin is discolored" | Glo2Facial **$195** · Luxe Rose Facial **$120** | Amber / Aundrea |
| 9 | **UV Damage** ⭐ | Sun history stored in the skin — **often invisible in normal light** | "This is your sun history. It's already in the skin, it just hasn't surfaced yet. In Florida, this one is never zero." | "This is sun damage we can reverse" | Procell MD **$349** · daily SPF (retail) | Amber |
| 10 | **Melasma** ⚠️ | Hormonally-driven, heat-reactive pigment pattern | "This pattern is consistent with melasma. That matters because melasma is heat-reactive — the aggressive treatments people expect actually make it worse. We go slower on purpose." | "We'll clear your melasma" / anything aggressive | **Consult first.** Gentle only: Glo2Facial · Skin Script. **Flag to Amber/Diana.** | Amber → Diana |

> **⭐ UV Damage is the second money slide — and it converts the "my skin is fine" client.**
> **Script:** *"Your skin in normal light looks great. Now watch — this is the UV channel. Everything
> you're seeing is sun that's already banked. Nothing here is urgent. But it's the argument for
> starting maintenance now rather than correction in five years."*
>
> **⚠️ MELASMA IS A BRAKE, NOT A GAS PEDAL.** Heat and aggression rebound melasma. If the M17 flags
> melasma: **do not** upsell aggressive microneedling in the moment. Say "I want Amber to look at this
> before we choose anything." Downgrading the sell here **builds** trust — and books the consult.

---

### GROUP C — VASCULAR & SENSITIVITY (the calm-it-down lane)

| # | Indicator | What it actually is | ✅ Say this | ❌ Never say | Book → | Who |
|---|---|---|---|---|---|---|
| 11 | **Sensitive Area** | Sub-surface redness / reactivity map | "Your redness map shows reactivity here. Before we do anything corrective, we want your barrier calm — otherwise we're building on sand." | "You have rosacea" (**never diagnose**) | LED **+$35** · Glo2Facial **$195** · GlyMed+ barrier homecare | Brandy |
| 12 | **Spider Vein** | Dilated surface capillaries | "Those are dilated capillaries. I'll be straight with you — we don't have a device that removes those here. What we *can* do is keep them from recruiting more." | "We'll get rid of those" (**we have no vascular laser**) | Barrier support · **refer out** for vascular | Amber (honest referral) |
| 13 | **Thermal map** | Inflammation / heat distribution | "This is your heat map. Heat is the enemy of pigment and the enemy of a calm barrier — it tells me how gently to work." | "You're inflamed / you have an inflammatory condition" | Informs protocol. Not sold standalone. | All |

> **Spider veins are your trust play.** Saying "we can't do that here" out loud, unprompted, buys you
> credibility for every yes that follows. Do not fudge it.

---

### GROUP D — TEXTURE, AGING & HYDRATION (the regenerative lane)

| # | Indicator | What it actually is | ✅ Say this | ❌ Never say | Book → | Who |
|---|---|---|---|---|---|---|
| 14 | **Acne** | Active lesion count + distribution | "Here's what's active right now — versus the porphyrin map, which is what's *coming*. Two different problems." | "We'll clear your acne" | Acne Bootcamp **$899** · Face Reality | Amber |
| 15 | **Wrinkle** | Line depth + count. **Split it: dynamic vs. static.** | "Two kinds here. Lines that appear when you move — that's muscle, that's Diana's lane. Lines that sit there at rest — that's collagen, that's mine." | "This will remove your wrinkles" | **Dynamic:** Tox **$14/unit** (Diana) · **Static:** Microneedling — Corrective **$295** · PRF Facial **$595** | Diana ↔ Amber |
| 16 | **Texture** | Surface roughness / irregularity | "Texture is the fastest-moving number on this whole report. It's also the one you'll feel before you see." | — | Dermaplane prep **+$45** · BioRePeel · Glo2Facial **$195** | Amber / Brandy |
| 17 | **Collagen** | AI-modeled firmness / density estimate | "This is a density estimate. It's the number that responds to *series*, not to single visits — collagen is built, not applied." | "This measures your actual collagen level" | Procell MD **3× $940 / 6× $1,675** · Sculpt & Lift **$180** · PRF **$595** | Amber / Diana |
| 18 | **Moisture** | Hydration / TEWL estimate | "Dehydration is the great faker — it makes lines, pores, and dullness all read worse than they are. Fix this first and half the report improves." | "You have dry skin" (dry ≠ dehydrated) | Glo2Facial **$195** · Hydration IV **$100** · Beauty Glow IV **$185** | Amber / Diana |

> **Wrinkle is the cross-referral engine.** It is the only indicator that splits cleanly across two
> providers. **Always name both.** "Diana handles the movement lines, I handle the resting lines —
> most people are doing one and wondering why the other didn't budge." That sentence sells two
> appointments and sounds like honesty, because it is.

---

### 🔮 FUTURE AGING SIMULATION — the closer

Not an indicator. It's the **series close.** Run it **last**, after you've already agreed on a plan.

**Script:**
> "Last thing. This projects the trajectory of the indicators we just talked about if nothing
> changes. It is a model, not a prophecy — but it's built from your actual scores. And this is
> exactly why I'd rather put you on a three-visit plan than sell you one facial today. Skin
> transforms through timing, consistency, and structure."

→ Then present the **3× series**, not the single. Never present the single first.

---

## 3. The consult flow (7 minutes, every time)

1. **Scan** — narrate as it runs. "Ten light sources. About three minutes."
2. **Shut up for 10 seconds** when the report lands. Let them look. They will point at something. **Whatever they point at is what you sell.**
3. **RULE OF THREE.** Do not read 18 numbers. Pick the **three lowest** scores and talk about only those. Eighteen numbers is a lecture; three numbers is a plan.
4. **Lead with a WIN.** Find their best score and say it first. *"Your hydration is genuinely strong — that's the hardest one to fake in this climate."* Trust buys permission.
5. **Name the lane, name the provider.** "That's Diana's lane." / "That's mine." Cross-referral is the whole point of the machine.
6. **Present the series, not the single.** Anchor on 3× or 6×. The single is the downgrade, not the offer.
7. **Rescan date.** *"We rescan at 90 days. Same machine, same lighting, same angles — so it's a real comparison, not a memory."* **This is the retention loop. Never skip it.**

---

## 4. Upsell ladder — read the report, pick the rung

| If the worst score is… | Entry (yes today) | Step up (the real ask) | Program (the goal) |
|---|---|---|---|
| Porphyrins / Comedo / Acne | Skin Reset Facial **$140** | Procell Pro **$250** | **Acne Bootcamp $899** |
| UV Damage / Pigment | Glo2Facial **$195** | Procell MD **$349** | **MD 6× $1,675** |
| Wrinkle (dynamic) | — | Tox **$14/unit** | Tox + Microchanneling cadence |
| Wrinkle (static) / Collagen | Sculpt & Lift **$180** | Microneedling Corrective **$295** | **MD 6× $1,675** or PRF **$595** |
| Texture / Pores | Dermaplane **+$45** add-on | Glo2Facial **$195** | Procell Pro 3× **$675** |
| Moisture | Glo2Facial **$195** | Hydration IV **$100** | Beauty Glow IV **$185** |
| Sensitivity / Redness | LED **+$35** | Barrier homecare | Gentle facial cadence |
| Melasma | ⚠️ **CONSULT ONLY** | — | — |

**Add-on attach rates — ask every time, they're the easiest yes on the menu:**
Dermaplane prep **+$45** · LED **+$35** · Glo2 Finish **+$95** · Topical PRF (face) **+$175** · Neck & Décolleté **+$95**

---

## 5. Retail attach — the report writes the prescription

The scan makes retail feel *prescribed* rather than *pushed*. Tie the product to the **number**, not to the shelf.

| Score driving it | Brand / product line |
|---|---|
| Porphyrins · Acne · Comedo | **Face Reality** (acne-safe protocol) |
| UV Damage · Brown Area | **Skin Script** brightening · **daily SPF** |
| Sensitive Area · Moisture | **GlyMed+** barrier support |
| Post-microchanneling | **Procell** homecare (protects the investment) |
| Post-treatment coverage | **Jane Iredale** (mineral, treatment-safe) |

**Script:** *"I'm not going to hand you a shelf. Your porphyrin number is what's driving this, so
there's exactly one line that matters for you right now."*

---

## 6. Hard stops 🚫

- 🚫 Never say the machine **diagnosed** anything. It **scored appearance**.
- 🚫 Never say **treat / cure / heal / clear / eliminate / permanent / guaranteed**.
- 🚫 Never say **"you have rosacea / melasma / an infection."** Say "this pattern is consistent with…" and refer to the provider.
- 🚫 Never promise **spider vein removal** — we have no vascular device.
- 🚫 Never upsell **aggressive treatment on a melasma flag** in the moment. Consult first.
- 🚫 Never say **discount / deal / % off / sale.** Say **investment · from · starting at.**
- 🚫 Never save a client photo or report to a personal device. Cloud/tablet only, consent on file.
- 🚫 Before/after images require **written consent** on file.

---

## 7. Objection handles

| They say | You say |
|---|---|
| "My skin's fine, I don't need this." | "Agreed — and the scan is free of pressure. Let's just get a baseline so that in five years you have something to compare against. That's the whole value." |
| "Is this just to sell me something?" | "It's the opposite. It's how I tell you what *not* to buy. Half of what I say today is going to be 'don't do that yet.'" |
| "That's a lot of money." | "It is an investment, and I'd rather you do three visits properly than six visits halfway. Skin transforms through timing and consistency — the number isn't the treatment, the structure is." |
| "Can you just do one and see?" | "We can. I'll be honest that one visit moves texture and moisture, and doesn't move collagen or pigment. If those are your top three, one visit is going to disappoint you and that's not a good day for either of us." |
| "Will this get rid of my [X]?" | "It's designed to improve the appearance of it. Individual outcomes vary, and your provider confirms candidacy. What I *can* promise is we'll rescan at 90 days on the same machine and you'll see exactly what moved." |

---

## 8. Provider lanes — where a scan routes

| Lane | Provider | Owns |
|---|---|---|
| **Advanced facials** | **Amber** (esthetician + RN assist) | Microchanneling · Microneedling · Glo2Facial · Procell MD/Pro · BioRePeel · Dermaplane · Carboxy · **PRF topical only — no injections** |
| **Injectables · IV · GLP-1** | **Diana, RN** | Tox · Filler · **PRF injections** · IV Hydration · Semaglutide/Tirzepatide |
| **Basic facials** | **Brandy** | Relaxing/maintenance facials · enzyme exfoliation · hydrodermabrasion · light peels · facial waxing |
| **Waxing · Lashes · Makeup · Permanent jewelry** | **Aundrea** (Brooke) | Body + facial waxing · lash lift/tint · makeup · permanent jewelry · the 3 Rose facials |

**Cross-referral is not optional.** If the scan lands outside your lane, hand it off in the room —
"let me get you in front of Diana for that." A scan that produces two bookings is the machine paying
for itself.

---

*Last updated 2026-07-14 · Prices per `docs/services/ALL-SERVICES-PRICING.MD` · Language per `docs/COMPLIANCE-COPY-RULES.md`*
