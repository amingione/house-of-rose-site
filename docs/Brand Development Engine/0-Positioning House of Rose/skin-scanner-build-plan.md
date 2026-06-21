---
date: 2026-05-08 15:21:11
created: 2026-05-08 15:21:11
categories:
- House of Rose: Combined Notes / 01_INBOX / 03_PLANS
---

# skin-scanner- uild-plan

# House of Rose — Skin Scanner: Strategic Build Plan

> **Goal:** A boutique luxury AI skin scanner that replicates Ageless AI's core value loop — facial analysis → aging simulation → budget-aware treatment plan → instant booking. Built on your existing TypeScript/Next.js/Sanity stack. Owned IP. Zero SaaS fees at scale.

* * *

## The Core Product Loop

```
Patient uploads photo
       ↓
AI analyzes skin (texture, laxity, tone, age estimation)
       ↓
System pulls financial context (income range, spending signals)
       ↓
Budget-aware treatment plan generated (only services you offer)
       ↓
"Book Now" → live scheduling via your booking system
       ↓
Lead captured to CRM with full scan data

```

* * *

## Phase 1 — Foundation (Weeks 1–2)

### 1A. Skin Analysis Engine

**Model:** GPT-4o Vision via OpenAI API (best vision + instruction-following combo available today)

**What you build:**

- Photo upload component (Next.js) with client-side compression
- System prompt ruleset (your proprietary IP — see Section: Training Ruleset below)
- Analysis output schema in Zod:

```ts
interface SkinAnalysis {
  ageEstimate: { low: number; high: number }
  skinConcerns: SkinConcern[] // texture | laxity | pigmentation | hydration | pores | redness
  severityScores: Record<SkinConcern, 1 | 2 | 3 | 4 | 5>
  primaryRecommendation: TreatmentSlug
  secondaryRecommendations: TreatmentSlug[]
  aestheticScore: number // 1–100, ranked vs age group
  confidenceLevel: 'high' | 'medium' | 'low'
}

```

**Treatment slugs** map directly to your Sanity `treatment` documents — the AI only recommends what you actually offer.

* * *

### 1B. The Training Ruleset Module (Your Competitive Moat)

This is the system prompt you iterate on over time. Think of it as your "clinical brain."

**Seed it with:**

```
You are the clinical AI for House of Rose, a luxury medical skin spa in Charlotte County, FL.

ANALYSIS RULES:
- Evaluate the uploaded image for: skin texture, laxity, pigmentation evenness, pore visibility, 
  redness/inflammation, hydration level, and estimated biological age vs chronological age.
- Score each concern 1–5 (1 = minimal, 5 = significant).
- Estimate patient age range based on visible skin markers only.
- Generate an Aesthetic Score (1–100) relative to the average for their estimated age group.
  A score of 70+ means above average for their age. Be honest but encouraging.

RECOMMENDATION RULES:
- Only recommend treatments from the provided [TREATMENT_CATALOG].
- Never recommend more than 1 primary + 2 secondary treatments.
- Sequence recommendations logically (e.g., Procell before injectables, not after).
- If a concern scores below 2, do not flag it as a treatment target.
- Use clinical language in the report but translate to patient-friendly summaries.

OUTPUT FORMAT: Return structured JSON only. No markdown, no preamble.

```

**You expand this ruleset over time** as you perform real treatments and observe outcomes. After 6 months of real patient data, this prompt becomes genuinely hard to replicate.

* * *

### 1C. Sanity Schema — Treatment Catalog

```ts
// sanity/schemas/treatment.ts
{
  name: 'treatment',
  fields: [
    { name: 'slug', type: 'slug' },
    { name: 'title', type: 'string' },
    { name: 'targetConcerns', type: 'array', of: [{ type: 'string' }] },
    { name: 'priceMin', type: 'number' },
    { name: 'priceMax', type: 'number' },
    { name: 'sessionCount', type: 'number' }, // typical treatment series
    { name: 'totalInvestmentMin', type: 'number' }, // priceMin * sessionCount
    { name: 'totalInvestmentMax', type: 'number' },
    { name: 'bookingUrl', type: 'url' }, // your scheduling system deep link
    { name: 'beforeAfterImages', type: 'array', of: [{ type: 'image' }] },
  ]
}

```

This is what gets injected into every AI call as `[TREATMENT_CATALOG]`. The AI can only recommend what's in here.

* * *

## Phase 2 — Financial Context Layer (Weeks 2–3)

This is how you replicate Ageless AI's income/intent scoring without their data partnerships.

### 2A. What Ageless Actually Does

They use third-party data enrichment (similar to Clearbit or People Data Labs) — patient enters name + email, API returns estimated HHI, job title, spending capacity.

### 2B. Your Implementation

**Option A — Direct enrichment (closest to Ageless):** Use [People Data Labs API](https://www.peopledatalabs.com/) or [Clearbit](https://clearbit.com/).

- Patient enters: first name, email, zip code (required to start scan)
- You hit enrichment API server-side
- Returns: estimated income range, employment sector, homeowner status
- Cost: ~$0.10–0.40 per lookup

**Option B — Self-reported (softer, but converts better for luxury):** After scan results display, show a single branded question:

```
"To build your personalized aesthetic plan, 
help us understand your investment comfort:"

○ I'm open to exploring options ($500–$1,500/year)
○ I'm ready to invest seriously ($1,500–$5,000/year)  
○ I want a comprehensive transformation ($5,000+/year)

```

Luxury clients self-select accurately when framing is aspirational, not income-shaming.

**Recommendation: Start with Option B, add Option A enrichment in Phase 3.**

### 2C. Budget-Gated Treatment Plans

```ts
function buildTreatmentPlan(
  analysis: SkinAnalysis,
  budgetTier: 'entry' | 'mid' | 'premium',
  catalog: Treatment[]
): TreatmentPlan {
  const eligible = catalog.filter(t => 
    t.targetConcerns.some(c => analysis.skinConcerns.includes(c)) &&
    t.totalInvestmentMin <= BUDGET_CAPS[budgetTier]
  )
  // Returns only treatments the patient can actually afford
  // Never surfaces a $4,000 package to a $500/yr budget tier
}

```

This is the feature that makes your scanner _trustworthy_. Patients feel seen, not sold.

* * *

## Phase 3 — Booking Integration (Week 3)

### 3A. Connect to Your Scheduling System

Your `treatment` Sanity documents each have a `bookingUrl` field pointing to your booking system (Jane App, Aesthetic Record, Boulevard, or Calendly as a start).

**The CTA button:**

```tsx
<button onClick={() => {
  // Log conversion event
  trackScanConversion({ scanId, treatmentSlug, budgetTier })
  // Open booking
  window.open(treatment.bookingUrl, '_blank')
}}>
  Book Your {treatment.title} Consultation →
</button>

```

### 3B. Lead Capture (Non-Negotiable)

Before results are shown, gate with:

```
Name | Email | Phone (optional)

```

Every scan = a lead in your CRM. Even if they don't book, you have them.

Send automated follow-up email 24hrs later with their scan summary PDF.

* * *

## Phase 4 — Aging Simulation (Week 4–6, Phase 2 of product)

This is the hardest Ageless feature to replicate. Do it after everything else is live.

**The approach:**

- Use [Replicate API](https://replicate.com/) — specifically the `fofr/face-to-many` or aging-specific models
- Generate two images: patient now vs. patient in 10–15 years without treatment
- Display side-by-side with treatment overlay: "with House of Rose care"

**Reality check:** The open models are noticeably less polished than Ageless. Frame it as "a glimpse, not a guarantee" — this actually plays better with a luxury medical positioning than overclaiming accuracy.

* * *

## Tech Stack Summary

| Layer | Tech |
| --- | --- |
| Frontend | Next.js App Router + Tailwind |
| AI Vision | OpenAI GPT-4o Vision API |
| Financial Enrichment | People Data Labs (Phase 3) |
| Aging Simulation | Replicate API (Phase 4) |
| CMS / Treatment Catalog | Sanity |
| Lead Storage | Sanity `scanLead` document type |
| Booking | Jane App / Boulevard deep links |
| Email Follow-up | Resend |
| Analytics | Posthog (scan → book conversion funnel) |

* * *

## Sanity Schema — Scan Lead

```ts
// sanity/schemas/scanLead.ts
{
  name: 'scanLead',
  fields: [
    { name: 'firstName', type: 'string' },
    { name: 'email', type: 'string' },
    { name: 'phone', type: 'string' },
    { name: 'scanDate', type: 'datetime' },
    { name: 'ageEstimate', type: 'object', fields: [
      { name: 'low', type: 'number' },
      { name: 'high', type: 'number' },
    ]},
    { name: 'aestheticScore', type: 'number' },
    { name: 'budgetTier', type: 'string' },
    { name: 'primaryRecommendation', type: 'reference', to: [{ type: 'treatment' }] },
    { name: 'converted', type: 'boolean' }, // did they click Book?
    { name: 'enrichmentData', type: 'object' }, // PDL response if used
  ]
}

```

* * *

## Cost Model at Launch

| Item | Cost |
| --- | --- |
| GPT-4o Vision per scan | ~$0.02–0.05 |
| Replicate aging sim (Phase 4) | ~$0.05–0.15 |
| PDL enrichment (Phase 3) | ~$0.10–0.40 |
| **Total per scan** | **~$0.07–0.60** |
| **vs. Ageless AI** | **~$200–500/mo flat** |

Break-even vs. Ageless: You'd need ~400–700 scans/month before building your own costs more. You won't hit that at launch.

* * *

## What Closes the Gap with Ageless Over Time

1. **Every patient scan** = training data for your ruleset refinement
2. **Every treatment outcome** = before/after pair you photograph and store
3. **After 200 patients:** Your system prompt has real outcome correlations baked in
4. **After 500 patients:** You have enough before/after data to fine-tune a vision model on your specific treatment results

This is the moat. Ageless has years of data. You start building yours day one.

* * *

## Launch Sequence

1. **Week 1:** Sanity schemas + treatment catalog populated
2. **Week 2:** Scan UI + GPT-4o Vision integration + lead capture
3. **Week 3:** Budget-gating logic + booking CTA live
4. **Week 4:** Resend follow-up email with scan PDF
5. **Week 6:** Aging simulation bolted on
6. **Month 3:** PDL enrichment added
7. **Month 6:** First ruleset refinement based on real patient outcomes

* * *

_Built for House of Rose LLC — Charlotte County, FL_ _Architecture: LaunchWell Brands_