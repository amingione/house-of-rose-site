# House of Rose — Canonical NAP Record
**Created**: 2026-04-28  
**Status**: Active canonical — every website page, directory, and schema block must match this exactly

---

## Canonical NAP String

```
Business Name:   House of Rose
Street Address:  525 E Olympia Ave, Unit 9
City, State ZIP: Punta Gorda, FL 33982
Phone:           (844) 941-7673
Website:         https://houseofrosefl.com
Email:           book@houseofrosefl.com
```

**E.164 phone format** (for `tel:` links and schema): `+18449417673`  
**Google Maps URL**: `https://maps.google.com/?q=525+E+Olympia+Ave+Unit+9+Punta+Gorda+FL+33982`

---

## NAP Consistency Rules

| Field | Canonical Format | Do NOT Use |
|-------|-----------------|------------|
| Business name | `House of Rose` | "House of Rose LLC", "House of Rose Med Spa", "HofR" |
| Street | `525 E Olympia Ave, Unit 9` | "525 East Olympia Ave", "525 E. Olympia", "Ste 9", "#9" |
| City, State | `Punta Gorda, FL` | "Punta Gorda, Florida", "PG, FL" |
| ZIP | `33982` | "33982-XXXX" (no +4 suffix needed) |
| Phone display | `(844) 941-7673` | "844-941-7673", "844.941.7673", "8449417673" |
| Phone schema | `+18449417673` | Any other format in JSON-LD |

---

## Website NAP Placement Status

| Location | Status | Format |
|----------|--------|--------|
| Footer — all pages | ✅ | `<address>` with `tel:` link |
| Contact page | ✅ | `<address>` wrapper on location block |
| MedicalBusiness JSON-LD (homepage) | ✅ | Full PostalAddress schema |
| Service page JSON-LD | ✅ | PostalAddress on provider object |
| Contact page hero description | ✅ | Plain text mention |
| Homepage CTA section | ✅ | Plain text address |

---

## Structured Data NAP Block (Copy-Reference)

```json
{
  "@type": "MedicalBusiness",
  "name": "House of Rose",
  "telephone": "+18449417673",
  "email": "book@houseofrosefl.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "525 E Olympia Ave, Unit 9",
    "addressLocality": "Punta Gorda",
    "addressRegion": "FL",
    "postalCode": "33982",
    "addressCountry": "US"
  }
}
```

---

## HTML Address Block (Footer Reference)

```html
<address class="not-italic">
  <span>House of Rose</span><br />
  <span>525 E Olympia Ave, Unit 9</span><br />
  <span>Punta Gorda, FL 33982</span><br />
  <a href="tel:+18449417673">(844) 941-7673</a>
</address>
```

---

## Citation Directory Status

| Directory | Status | NAP Match | Verified | Notes |
|-----------|--------|-----------|----------|-------|
| Google Business Profile | ⚠️ Pending | — | — | Requires manual claim — top priority |
| Bing Places | ⚠️ Pending | — | — | Can import from GBP once live |
| Apple Maps | ⚠️ Pending | — | — | Requires Apple ID |
| Yelp | ⚠️ Pending | — | — | Check if auto-listed; claim if so |
| Facebook Business | ⚠️ Pending | — | — | Create at facebook.com/houseofrosefl |
| Healthgrades | ⚠️ Pending | — | — | High priority for med spa / healthcare |
| Zocdoc | ⚠️ Pending | — | — | Medical aesthetics category |
| Vagaro | ⚠️ Pending | — | — | Beauty/med spa specific directory |
| StyleSeat | ⚠️ Pending | — | — | Wellness/spa specific |
| Yellow Pages | ⚠️ Pending | — | — | Tier 2 — do after Tier 1 |
| BBB | ⚠️ Pending | — | — | Free basic listing |
| Foursquare | ⚠️ Pending | — | — | Feeds third-party apps |
| Nextdoor | ⚠️ Pending | — | — | Local neighborhood reach |

**When submitting to any directory:**
- Copy the canonical NAP string above exactly — do not retype from memory
- Use `(844) 941-7673` as the display format for all directories
- Website URL: `https://houseofrosefl.com` (no trailing slash)
- Business name: `House of Rose` — never append keywords or qualifiers

---

## Industry-Specific Directories (Med Spa / Healthcare)

| Directory | URL | Priority |
|-----------|-----|----------|
| Healthgrades | healthgrades.com/office/claim | P1 |
| Vagaro | vagaro.com | P1 — beauty/med spa aggregator |
| StyleSeat | styleseat.com | P2 |
| RealSelf | realself.com | P2 — aesthetic treatments |
| Booksy | booksy.com | P2 |
| Zwivel | zwivel.com | P3 — plastic surgery / aesthetics directory |
| American Med Spa Association | americanmedspa.org | P3 — professional listing |

---

## NAP Audit Schedule

- **Pre-launch**: Confirm GBP + Bing + Apple Maps submitted before site goes live
- **Month 1**: Submit all Tier 1 directories (GBP, Bing, Apple, Yelp, Facebook, BBB, Healthgrades)
- **Month 2**: Submit Tier 2 + industry-specific directories
- **Quarterly**: Re-audit top 10 directories for NAP consistency using Moz Local or Whitespark
