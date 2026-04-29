# House of Rose — Analytics Setup Guide (PHASE-10)
**Created**: 2026-04-28  
**Status**: ✅ Complete — GA4 property and tracking setup completed

---

## GA4 Integration Status

The GA4 snippet is **already wired** into `BaseLayout.astro`. It fires only when `PUBLIC_GA4_ID` is set.

**Activation checklist:**
1. [x] Create GA4 property → copy Measurement ID (format: `G-XXXXXXXXXX`)
2. [x] Add `PUBLIC_GA4_ID=G-XXXXXXXXXX` to Netlify env vars (house-of-rose-web site)
3. [x] Trigger redeploy → verify in GA4 Real-Time view

---

## Step 1 — Create GA4 Property

1. Go to [analytics.google.com](https://analytics.google.com)
2. Admin → Create → Property
3. Property name: `House of Rose`
4. Reporting timezone: `(GMT-05:00) Eastern Time`
5. Currency: `USD`
6. Business objective: `Generate leads`
7. Platform: `Web`
8. Website URL: `https://houseofrosefl.com`
9. Stream name: `houseofrosefl.com`
10. Copy the **Measurement ID** (`G-XXXXXXXXXX`)

---

## Step 2 — Add Env Var to Netlify

Netlify → Sites → house-of-rose-web → Site configuration → Environment variables:

```
Key:   PUBLIC_GA4_ID
Value: G-XXXXXXXXXX    ← paste your Measurement ID here
Scope: Builds
```

Also add the GSC verification token (see GSC-SUBMISSION.md):
```
Key:   PUBLIC_GSC_VERIFY
Value: [verification token from GSC]
Scope: Builds
```

Trigger a new deploy after adding both vars.

---

## Step 3 — Configure Conversion Events

In GA4 → Admin → Events, mark these as conversions:

| Event | Trigger |
|-------|---------|
| `generate_lead` | Contact form submit |
| `click` (outbound to Gloss Genius) | Book Now button clicks |
| `phone_call_click` | `tel:` link clicks |

### Custom Event Tracking (add to contact.astro form)

The form submission currently POSTs to Netlify. To fire a GA4 event on success, add to `contact.astro`:

```html
<script is:inline>
  document.querySelector('form[name="contact"]').addEventListener('submit', function() {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'generate_lead', {
        event_category: 'Contact',
        event_label: 'Contact Form Submit'
      });
    }
  });
</script>
```

### Book Now Click Tracking

Add to any `<a href="https://houseofrose.glossgenius.com/services">` elements:

```html
onclick="gtag && gtag('event', 'click', { event_category: 'outbound', event_label: 'Book Now — Gloss Genius' })"
```

### Phone Click Tracking

The `tel:+18449417673` links in footer and contact page. Add:

```html
onclick="gtag && gtag('event', 'phone_call_click', { event_category: 'Contact', event_label: '844-941-7673' })"
```

---

## Step 4 — Link to Google Search Console

GA4 → Admin → Product Links → Search Console Linking → Add property → select `houseofrosefl.com`

This unlocks the Queries report in GA4 (organic keywords driving traffic).

---

## Step 5 — Audience Configuration

GA4 → Admin → Audiences → New audience:

| Audience | Condition | Use |
|----------|-----------|-----|
| `HOR Engaged` | Session duration > 60s OR pages > 2 | Remarketing baseline |
| `HOR Form Starters` | Viewed `/contact` but no `generate_lead` | Retargeting warm leads |
| `HOR Bookers` | Clicked outbound to Gloss Genius | High-intent visitors |

---

## Step 6 — Connect Google Ads (when ready)

GA4 → Admin → Product Links → Google Ads Linking → Add account

Import conversions from GA4 into Google Ads for smart bidding on `generate_lead`.

---

## Reporting Baseline (Pull at Day 0 → Day 30 → Day 60)

| Metric | Where | Target |
|--------|-------|--------|
| Organic sessions | GA4 → Acquisition → Traffic acquisition (filter: Organic Search) | Establish baseline, expect growth |
| Avg engagement time | GA4 → Engagement → Overview | > 90s |
| Contact form submits | GA4 → Events → generate_lead | Track monthly volume |
| Book Now clicks | GA4 → Events → click (filter: outbound) | Track monthly volume |
| Phone clicks | GA4 → Events → phone_call_click | Track monthly volume |
| Top landing pages | GA4 → Engagement → Landing page | Should be `/`, service pages |
| GSC CTR | GSC → Performance | Target > 4% CTR |

---

## Ahrefs Analytics (Already Active)

The Ahrefs analytics snippet is already in BaseLayout (hardcoded):
```html
<script src="https://analytics.ahrefs.com/analytics.js" data-key="XdzOvGXmUENnBpyYIDhXOQ" async></script>
```

This tracks backlink clicks and organic keyword attribution separately from GA4. No action needed.
