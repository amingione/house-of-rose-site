# House of Rose — Post-Launch Monitoring Baseline (PHASE-14)
**Created**: 2026-04-28  
**Launch target**: Ready for baseline collection; GSC verification, GBP claim, GA4 tracking, and review acquisition flow are complete  
**Review cadence**: Weekly for 60 days → monthly thereafter

---

## Day 0 Baseline Snapshot

Pull these immediately after the first successful deploy to production. Enter actual values when available.

### GSC Baseline (pull from GSC → Performance, last 28 days)

| Metric | Day 0 | Day 30 | Day 60 |
|--------|-------|--------|--------|
| Total impressions | — | | |
| Total clicks | — | | |
| Avg CTR | — | | |
| Avg position (all queries) | — | | |
| Pages indexed | — | | |

### Organic Keyword Positions (track weekly in Ahrefs)

| Keyword | Target URL | Day 0 | Day 30 | Day 60 |
|---------|-----------|-------|--------|--------|
| luxury spa Punta Gorda FL | `/` | — | | |
| spa Punta Gorda FL | `/` | — | | |
| microchanneling Punta Gorda | `/services/microchanneling/` | — | | |
| IV hydration Punta Gorda | `/services/iv-hydration-therapy/` | — | | |
| Botox Punta Gorda FL | `/services/injectables/` | — | | |
| hormone therapy Punta Gorda | `/services/hormone-therapy/` | — | | |
| GLP-1 weight loss Punta Gorda | `/services/glp-1-weight-management/` | — | | |
| semaglutide Punta Gorda | `/services/glp-1-weight-management/` | — | | |
| HydraFacial Punta Gorda | `/services/hydrafacial/` | — | | |
| facials Punta Gorda FL | `/services/facials/` | — | | |
| dermaplaning Punta Gorda | `/services/dermaplaning/` | — | | |
| chemical peel Punta Gorda | `/services/chemical-peels/` | — | | |
| lash extensions Punta Gorda | `/services/lash-extensions/` | — | | |
| permanent makeup Punta Gorda | `/services/permanent-makeup/` | — | | |
| wedding makeup Punta Gorda FL | `/services/event-makeup/` | — | | |
| facial waxing Punta Gorda | `/services/facial-waxing/` | — | | |
| suite rental for estheticians Punta Gorda | `/rent-a-room/` | — | | |

### GA4 Baseline (pull after 30 days data accumulates)

| Metric | Month 1 | Month 2 | Month 3 |
|--------|---------|---------|---------|
| Organic sessions | — | | |
| Direct sessions | — | | |
| Contact form submits | — | | |
| Book Now clicks | — | | |
| Phone clicks | — | | |
| Avg engagement time | — | | |
| Bounce rate (engagement rate inverse) | — | | |

### Core Web Vitals Baseline (PageSpeed Insights)

Run at: `https://pagespeed.web.dev/` on `https://houseofrosefl.com`

| Metric | Target | Day 0 | Day 30 |
|--------|--------|-------|--------|
| LCP | < 2.5s | — | |
| INP | < 200ms | — | |
| CLS | < 0.1 | — | |
| Mobile score | > 85 | — | |
| Desktop score | > 95 | — | |

---

## 60-Day Monitoring Schedule

### Week 1–2 (Technical Verification)

- [ ] All 27 deployed indexable files confirmed indexed in GSC Coverage report
- [ ] 0 crawl errors in GSC
- [ ] Sitemap status: "Success"
- [ ] GBP listing live in Google Maps
- [ ] Core Web Vitals passing in GSC (green)
- [ ] Schema validation: [Rich Results Test](https://search.google.com/test/rich-results) on homepage + one service page
- [ ] GA4 receiving sessions (Real-Time view shows activity)

### Week 3–4 (First Impressions Data)

- [ ] Pull GSC Performance report — what queries are triggering impressions?
- [ ] Check average position for primary keywords — baseline established
- [ ] Review top 5 landing pages by organic sessions in GA4
- [ ] Ahrefs: check if domain has been crawled (Domain Rating initialized)
- [ ] GBP: first review requested from a client

### Week 5–8 (Early Trend Identification)

- [ ] Compare Week 1 vs Week 5 organic impressions — upward trend?
- [ ] Identify any pages with high impressions but low CTR → rewrite meta title/description
- [ ] Check GBP insights: search queries, map views, direction requests
- [ ] Blog post #1 published per content calendar
- [ ] Ahrefs: any backlinks acquired? If not, begin outreach

---

## Alert Thresholds

Set up GSC email alerts for:

| Alert | Threshold |
|-------|-----------|
| Coverage errors | > 0 new errors |
| Security issues | Any |
| Manual action | Any |

Set up GA4 custom alerts (Admin → Custom insights):

| Alert | Threshold |
|-------|-----------|
| Organic sessions drop | > 20% week-over-week |
| Zero organic sessions in a day | Triggered |
| Contact form submits | > 5 in a week (positive) |

---

## Monthly KPI Report (Pull on 1st of each month)

Copy this template into a Google Sheet or Notion database:

```
Month: [Month Year]
Organic Sessions: 
Organic Users: 
Contact Submits: 
Book Now Clicks: 
Phone Clicks: 
Avg Engagement Time: 
Top 3 Landing Pages (organic): 
Top 5 Ranking Keywords: 
GBP Views: 
GBP Actions (calls + directions + website): 
Ahrefs DR: 
Referring Domains: 
New Backlinks: 
```

---

## 6-Month SEO Health Checklist

Run this audit every 6 months using Ahrefs Site Audit or Screaming Frog:

- [ ] Broken links (4xx) — fix or redirect
- [ ] Duplicate content — check for canonical drift
- [ ] Missing meta descriptions
- [ ] Images missing `alt` text
- [ ] New orphan pages (no internal links pointing to them)
- [ ] Schema markup still valid (Google updates validators periodically)
- [ ] `robots.txt` — no new blocks introduced accidentally
- [ ] SSL cert valid — auto-renews via Netlify
- [ ] NAP consistency — re-audit all top 10 citation directories
- [ ] GBP — all photos current, hours accurate, Q&A responses active

---

## Competitor Monitoring (Quarterly)

Track organic visibility for:

| Competitor | Domain | Track |
|-----------|--------|-------|
| Carlisa Health & Wellness | carlisahealthandwellness.com | Keyword overlap |
| Sweet Spot | sweetspotmedispa.com | Keyword overlap |
| Nuview | nuviewmedspa.com | Keyword overlap |

Ahrefs → Competitive Analysis → Keyword Gap — run quarterly and flag any new keywords competitors are ranking for that House of Rose is not.
