# House of Rose — GSC & Bing Submission Guide (PHASE-13)
**Created**: 2026-04-28  
**Status**: ✅ Complete — GSC verification and sitemap submission completed

---

## Google Search Console Verification

### Method 1: HTML Meta Tag (Recommended — already wired)

The BaseLayout is configured to output the GSC meta tag automatically when `PUBLIC_GSC_VERIFY` is set.

1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Add property → URL prefix → `https://houseofrosefl.com`
3. Select verification method: **HTML tag**
4. Copy the `content` value from the tag shown (looks like: `abc123XYZ...`)
5. In Netlify → house-of-rose-web → Environment variables, add:
   ```
   Key:   PUBLIC_GSC_VERIFY
   Value: [paste the content value — NOT the full tag, just the content value]
   Scope: Builds
   ```
6. Trigger a new deploy
7. Return to GSC and click **Verify**

The meta tag that gets injected:
```html
<meta name="google-site-verification" content="[PUBLIC_GSC_VERIFY value]" />
```

### Method 2: DNS TXT Record (Backup)

If HTML tag fails, use DNS:
1. GSC → HTML tag method → switch to "Domain property" verification
2. Copy the TXT record value
3. Add to DNS at your registrar: `TXT @ google-site-verification=[value]`
4. Wait up to 72 hours for DNS propagation

---

## Sitemap Submission to GSC

After verification:

1. GSC → Sitemaps (left nav)
2. Add sitemap: `https://houseofrosefl.com/sitemap.xml`
3. Click Submit
4. Verify status shows "Success" within 24–48 hours

**Current sitemap URLs:**
```
https://houseofrosefl.com/sitemap.xml
```

The sitemap includes 27 deployed indexable URLs:
- 7 static pages: `/`, `/services/`, `/blog/`, `/experience/`, `/contact/`, `/rent-a-room/`, `/privacy-policy/`
- 15 service pages: `/services/[slug]/`
- 5 collection pages: `/services/collections/` plus 4 collection detail pages

---

## Request Indexing (After Sitemap Submission)

For each priority page, use GSC URL Inspection → Request Indexing:

Priority order:
1. `https://houseofrosefl.com/` (homepage)
2. `https://houseofrosefl.com/services/microchanneling` 
3. `https://houseofrosefl.com/services/iv-hydration-therapy`
4. `https://houseofrosefl.com/services/botox-fillers`
5. `https://houseofrosefl.com/services/hormone-therapy`
6. `https://houseofrosefl.com/services/glp1-weight-loss`
7. `https://houseofrosefl.com/services`
8. `https://houseofrosefl.com/contact`

---

## Bing Webmaster Tools Submission

### Import from GSC (fastest method)

1. Go to [bing.com/webmasters](https://bing.com/webmasters)
2. Sign in with Microsoft account
3. Click **Import from Google Search Console**
4. Authenticate with the same Google account used for GSC
5. Select `houseofrosefl.com` → Import
6. Bing automatically imports verification + sitemap

### Manual method (if import fails)

1. Add site: `https://houseofrosefl.com`
2. Verification: HTML meta tag — copy the Bing tag content, add to Netlify as `PUBLIC_BING_VERIFY`
3. Sitemaps → Submit → `https://houseofrosefl.com/sitemap.xml`

---

## Post-Verification Checklist

- [x] GSC property verified (`https://houseofrosefl.com`)
- [x] Sitemap submitted to GSC → shows "Success"
- [ ] URL Inspection run on homepage — no errors
- [ ] Index coverage report reviewed — 0 errors
- [ ] Core Web Vitals report reviewed
- [ ] Bing Webmaster Tools verified
- [ ] Bing sitemap submitted
- [ ] GA4 linked to GSC property (in GA4 → Admin → Product Links)

---

## GSC Monitoring — First 60 Days

| Week | Action |
|------|--------|
| Week 1 | Verify all 27 deployed indexable URLs discovered in Coverage report |
| Week 2 | Check for crawl errors → fix any 404s |
| Week 4 | Pull Performance report — which queries are driving impressions? |
| Week 8 | Compare click-through rates by page — optimize titles/descriptions for low CTR pages |

---

## Common GSC Issues and Fixes

| Issue | Fix |
|-------|-----|
| "Discovered — not yet indexed" | Request indexing manually; check for crawl budget issues |
| "Crawled — not indexed" | Check thin content, duplicate content, or quality signals |
| "Redirect error" | Verify `Astro.site` matches production URL |
| "Soft 404" | Add explicit `noindex` to any empty/stub pages |
| CWV failing | Check LCP (preload image), INP (minimal JS), CLS (image dimensions set) |
