# Measurement and Lead Operations

## Primary conversion

A primary lead conversion is counted only when the skin-analysis or contact form succeeds and the visitor reaches `/thank-you/?lead=skinAnalysis` or the equivalent verified lead state. Clicks, landing-page views, calls, and booking-link clicks remain supporting events.

## Qualified lead definition

A qualified lead is a reachable person who:

1. lives within a practical House of Rose service area;
2. expresses interest in a currently offered consultation or service;
3. provides a usable email address or phone number; and
4. is willing to discuss an appointment.

Qualification does not determine medical or treatment candidacy. That remains with the appropriate provider.

## Response workflow

- During Monday–Friday studio hours, acknowledge new leads within two business hours.
- Use the contact method the person requested. If no preference is captured, begin with a concise text or email and offer a call.
- Do not request detailed medical history over Meta, email, or ordinary text messaging.
- Record contact attempt, response, service interest, consultation status, and booking outcome.
- After two unanswered attempts over three business days, close the outreach loop politely; do not pressure.

Suggested first reply:

> Hi [First name], this is House of Rose Aesthetics in Punta Gorda. Thank you for requesting a consultation. What would you most like to explore, and is text or a quick call easier for scheduling?

## Required events

| Event | Trigger | Primary? |
| --- | --- | --- |
| `generate_lead` | Successful lead submission and thank-you state | Yes |
| `phone_click` | Tap on a `tel:` link | No |
| `sms_click` | Tap on an `sms:` link | No |
| `booking_click` | Click to the verified GlossGenius booking domain | No |

Never send names, emails, phone numbers, form messages, or health details to analytics events.

## Pre-launch acceptance test

1. Open every final URL on iPhone-size and desktop-size screens.
2. Confirm the inner-page URL keeps its trailing slash before the query string.
3. Submit a test lead from a Google-tagged URL and a Meta-tagged URL.
4. Confirm all five UTM fields, landing page, and referrer reach the lead record and notification email.
5. Confirm `generate_lead` fires once and only after successful submission.
6. Confirm click-to-call and booking-link events contain no personally identifiable information.
7. Confirm owner notification and visitor confirmation are received.
8. Confirm the final platform preview shows the exact logo, uncut text, correct destination, and no automatic enhancement that changes the studio or provider.
9. Confirm the before/after asset is absent from cold paid campaigns.
10. Confirm the current service menu still offers every product or branded treatment named in the ad.

## Optimization cadence

### Days 1–3

- Verify delivery, search terms, landing-page views, form success, notifications, and calls.
- Correct tracking or destination problems before judging creative.

### Days 4–7

- Add clearly irrelevant Google negatives.
- Compare qualified-lead signals, not just click-through rate.
- Keep the three initial Meta ads active unless an ad is rejected or broken.

### Days 8–14

- Retain the strongest qualified-lead producer.
- Rotate in the three reserve concepts.
- Test the higher-intent Meta form only when the website campaign has fewer than three verified leads and tracking is sound.

### Days 15–30

- Move budget toward service lanes producing qualified consultations.
- Increase a winner by no more than 20% every 72 hours.
- Pause an ad, ad group, or keyword cluster after $150 without a qualified lead, after reconfirming tracking and destination quality.
- Do not introduce Display, Performance Max, TikTok, or a new paid network during this learning window.

## Reporting hierarchy

1. Booked consultations.
2. Cost per booked consultation.
3. Qualified leads and cost per qualified lead.
4. Lead-to-consultation rate.
5. Response time.
6. Supporting diagnostics: search relevance, landing-page engagement, CTR, CPC, form completion, and creative fatigue.

Revenue and treatment outcomes should never be inferred when they have not been recorded.
