# House of Rose — Visibility-to-Consultation Operating Plan

**Campaign:** See Your Skin First  
**Primary CTA:** Begin With a Skin Consultation  
**Primary outcome:** qualified skin-consultation leads  
**Public content source:** Sanity  
**Planning and approvals:** Notion  
**Staff execution:** this runbook and the matching HoR-ops task  
**Measurement:** GA4, Google Search Console, Ahrefs, Sanity lead records, and GlossGenius reconciliation

## Binding truth and publishing rules

1. Verify service name, provider lane, availability, price, and protocol in this order:
   - `CLAUDE.md` and current local service/pricing documentation.
   - The designated House of Rose HQ service record in Notion.
   - Manufacturer, clinical, or local-market research when a claim still needs support.
2. Sanity is the only public publishing source. Notion does not publish directly to the website.
3. Public service and package queries include only records explicitly marked `live` or `actual-menu`.
4. Do not publish memberships, passes, discount campaigns, invented treatment names, overt luxury labels, PRF hair restoration, GlowTox, or unsupported exosome/peptide claims.
5. Keep topical PRF and injectable PRF provider lanes distinct. Amber's PRF is topical only; injectable PRF is Diana, RN's clinical lane.
6. Use one of the seven canonical page types and the shared JSON-LD builders. Add internal links, the XML/HTML sitemaps, and `llms.txt` coverage before release.
7. Case studies remain unpublished unless `consentGiven == true`.

## Client journey

1. **Discovery:** a local page, service answer, cost guide, comparison, Google Business Profile post, organic social post, or paid-search ad.
2. **Consideration:** `/skin-analysis/` explains the scan, provider review, limitations, candidacy, and next steps.
3. **Lead:** the client submits the skin-consultation form or uses a tracked call, text, or booking link.
4. **Response:** Sanity records attribution and a follow-up deadline. The team receives an email notification; the client receives a transactional acknowledgment.
5. **Consultation:** the provider reviews the images and creates an individualized treatment map.
6. **Care:** the client books the verified individual service or series appropriate to the provider's assessment.
7. **Follow-up:** the lead record is reconciled with GlossGenius and updated through qualified, consultation booked, and completed stages.

## Four-week campaign cadence

### Week 1 — See the starting point

- Explain why choosing a treatment before understanding the skin can create scattered care.
- Send all primary CTAs to `/skin-analysis/`.
- GBP/social angle: “See your skin first, then choose with context.”

### Week 2 — Explain the analysis

- Show what the scan reviews and what it cannot diagnose.
- Explain the provider's role in candidacy and sequencing.
- Reuse the FAQ “Is AI Skin Analysis a medical diagnosis?”

### Week 3 — Compare suitable paths

- Feature ProCell Microchanneling, topical PRF needling, Glo2Facial, and dermaplaning.
- Link the ProCell and topical PRF cost guides and the microchanneling-vs-microneedling comparison.
- Avoid declaring one treatment universally better.

### Week 4 — Proof and next step

- Publish one consented review, client question, case note, or image set.
- Include the actual protocol and timeframe when a case study is approved.
- Close with “Begin With a Skin Consultation.”

## Content clusters

| Cluster | Canonical route | Supporting assets |
|---|---|---|
| Skin consultation | `/skin-analysis/` | FAQ, local pages, consultation form |
| ProCell Microchanneling | `/services/microchanneling/` | `/cost/procell-microchanneling-cost-punta-gorda/`, comparison, FAQs |
| Topical PRF needling | `/services/prf-microneedling/` and `/services/prf/` | `/cost/prf-microneedling-cost-punta-gorda/`, comparison, FAQs |
| Glo2Facial | `/services/glo2facial/` | Process, candidacy, FAQs, skin-analysis links |
| Dermaplaning | `/services/dermaplaning/` | Process, candidacy, FAQs, skin-analysis links |
| Local authority | `/areas/punta-gorda/` and `/areas/port-charlotte/` | Honest location statement and service links |

## Lead-response SOP

### Service-level objective

- During Monday–Friday, 9:00 AM–5:00 PM, respond within two business hours.
- Submissions before opening are due by 11:00 AM that business day.
- Submissions after 3:00 PM, on weekends, or after closing are due by 11:00 AM the next business day.

### Status definitions

- **New:** saved, notification delivered, no personal reply yet.
- **Contacted:** a team member sent the first personal reply or completed a call/text attempt.
- **Qualified:** the request fits a current provider lane and a reasonable next step is established.
- **Consultation Booked:** a matching appointment exists in GlossGenius.
- **Completed Booking:** the matched first appointment was completed.
- **Closed:** duplicate, spam, not a fit, declined, unreachable after the approved follow-up sequence, or otherwise resolved.

### Handling sequence

1. Open the Sanity lead and confirm the interest, source, follow-up deadline, and SMS consent.
2. Assign an owner. Do not send marketing texts without marketing consent.
3. Reply in the client's chosen channel. State what happens next; do not diagnose or promise candidacy.
4. Update `firstContactedAt` and status to Contacted.
5. When appropriate, update to Qualified and record `qualifiedAt`.
6. Match the appointment manually in GlossGenius, then set Consultation Booked and `bookedAt`.
7. After the visit, mark Completed Booking and `completedAt`, or record a concise non-clinical close reason.

## Proof workflow

- Target: one usable proof asset per week.
- Accepted inputs: review, approved testimonial, recurring client question, de-identified case note, or written-consent before/after set.
- Never incentivize a review.
- Store consent with the case-study record; do not infer consent from a message or social post.
- Before/after records must name the actual protocol and timeframe and state that individual outcomes vary.

## Paid-search pilot

- Budget: $30/day for 30 days; hard cap $900.
- Launch only after attribution, notifications, analytics, redirects, content checks, and staff response rehearsal pass.
- Ad groups:
  - Skin analysis and skin consultation in Punta Gorda.
  - ProCell Microchanneling in Punta Gorda/Port Charlotte.
  - Topical PRF microneedling/microchanneling in Punta Gorda.
  - Supporting local medical-spa intent where the landing page answers the query.
- Match types: exact and phrase for the pilot.
- Negatives: jobs, salary, training, certification, course, device, machine, wholesale, used, cheap, coupon, free.
- Send each ad to the most relevant canonical page, never to a generic homepage when a service page exists.
- Pause an ad group after $150 without a qualified lead.
- Do not scale until at least ten attributed leads have been reviewed for quality and booking rate.
- Paid social remains deferred until the consented proof library and retargeting audience are useful.

## Ahrefs Rank Tracker set

Track these 25 terms on mobile and desktop for the Houseofrosefl project:

1. house of rose aesthetics
2. house of rose punta gorda
3. med spa punta gorda
4. medical spa punta gorda
5. med spa in punta gorda
6. med spa port charlotte
7. skin consultation punta gorda
8. skin analysis punta gorda
9. ai skin analysis punta gorda
10. procell microchanneling
11. procell microchanneling punta gorda
12. procell microchanneling port charlotte
13. what is procell microchanneling
14. how much does procell microchanneling cost
15. prf microneedling punta gorda
16. prf microneedling port charlotte
17. what is prf microneedling
18. what is microneedling with prf
19. prf microneedling cost
20. glo2facial punta gorda
21. what is a glo2facial
22. dermaplaning punta gorda
23. botox punta gorda
24. botox port charlotte
25. weight loss punta gorda

## Monthly AI visibility prompt panel

Test the same prompts in Google AI Mode, ChatGPT, and Perplexity until Ahrefs Brand Radar is available. Record engine, prompt, date, brand mentioned, houseofrosefl.com cited, competing businesses, and notable answer changes.

- What is a reputable advanced aesthetics studio in Punta Gorda?
- Where can I get ProCell Microchanneling near Port Charlotte?
- What does ProCell Microchanneling cost near Punta Gorda?
- What is the difference between microchanneling and microneedling?
- Where can I start with a skin analysis in Punta Gorda?
- Who offers topical PRF with microneedling in Charlotte County?
- Where can I get a Glo2Facial near Punta Gorda?
- What should I look for when choosing a medical spa in Punta Gorda?

## Weekly and monthly scorecard

### Weekly

- Leads by source and campaign.
- Median first-response time.
- Qualified leads and consultations booked.
- One approved proof asset.
- Pages published or updated.
- Broken form, email, analytics, or booking-link incidents.

### Monthly

- Search Console impressions, clicks, CTR, and query/page movement.
- Ahrefs rankings and site-audit errors.
- GA4 consultation leads and booking/call/text clicks by landing page.
- Lead-to-qualified, qualified-to-booked, and booked-to-completed rates.
- Paid qualified cost per lead and booked consultation cost.
- Review count and consented proof assets added.
- AI prompt mentions and citations.

## Release gate

Run the following before publishing or starting paid traffic:

```bash
npm run guard:drift
npm run verify:visibility
npm run lint
npm run build:web
npm run ve:check
```

Then recrawl in Ahrefs and confirm there are no canonical-to-redirect errors, duplicated brand titles, broken images, missing alternatives, or active error-level issues.

