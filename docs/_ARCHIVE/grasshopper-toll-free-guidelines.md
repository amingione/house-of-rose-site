# H of R - Grasshopper Toll Free Registration

Date: SEPTEMBER 1, 2026
Category: Grasshopper
> GRASSHOPPER IS NO LONGER BEING USED - THE TOLL FREE NUMBER IS PORTED INTO OUR VERIZON BUSINESS ACCOUNT
## Regis

Date: Aug 1, 2026
Category: Grasshopper
---

## Registration-ready implementation

Status as of August 1, 2026: phone SMS is **not enabled** and Grasshopper verification remains pending.
The website implementation is retained for carrier review, but no customer-facing text-message CTA may
be published until activation is confirmed. This is a carrier registration package, not a substitute
for TCPA or Florida counsel.

### Canonical registration facts

| Field | Registration value |
|---|---|
| Messaging brand / legal entity | House of Rose Aesthetics LLC |
| Customer-facing brand | House of Rose Aesthetics |
| Toll-free number | +18449417673 |
| Website | https://houseofrosefl.com/ |
| Opt-in page | https://houseofrosefl.com/contact/ |
| Privacy policy + messaging terms | https://houseofrosefl.com/privacy-policy/ |
| Support email | info@houseofrosefl.com |
| Business address | 525 E Olympia Ave, Unit 9, Punta Gorda, FL 33950 |
| Messaging use case | Conversational support, informational messages, and separately consented marketing messages |
| Opt-in method | Website form with separate, unchecked informational and marketing consent choices and an explicit decline choice |

The EIN/tax ID and exact IRS legal-name record are not stored in this repository. Copy those
directly from the IRS document or Grasshopper billing record; do not infer or reformat them.

### Application answers to copy

**How do you get permission to message your contacts?**

Select: `Via a form on my website: Contacts provide their phone number and check a box to opt in to messaging`

URL: `https://houseofrosefl.com/contact/`

**Describe your opt-in process**

> Contacts opt in on our website contact page at https://houseofrosefl.com/contact/ by entering
> their mobile number and affirmatively selecting an unchecked box for informational messages,
> marketing messages, or both. The form identifies House of Rose Aesthetics LLC and +18449417673, describes
> each message category, states that consent is not a condition of purchase, discloses variable
> message frequency and message/data rates, provides STOP and HELP instructions, states that
> mobile opt-in information is not shared, and links to our privacy policy and messaging terms.
> Contacts may explicitly decline all text messages and still submit the contact form.

**Opt-in confirmation message**

> Thank you for opting in to receive messages from House of Rose Aesthetics LLC. Msg frequency varies. Msg &
> data rates may apply. Reply HELP for help. Reply STOP to opt out.

### Evidence package

Local layout-review artifact:
[`evidence/grasshopper-contact-opt-in-local.png`](evidence/grasshopper-contact-opt-in-local.png)
(PNG, approximately 84 KB). This proves the implementation renders correctly, but it is **not**
the final carrier evidence because it was captured from localhost.

After the site is deployed:

1. Open `https://houseofrosefl.com/contact/` in a private browser window.
2. Capture a PNG showing the phone field, full disclosure, all three unchecked consent choices,
   privacy-policy URL, and submit button in one continuous image.
3. Keep the PNG under 5 MB and upload it in Grasshopper's **Evidence** field.
4. Open `https://houseofrosefl.com/privacy-policy/` and confirm the **Data Sharing** and
   **House of Rose Aesthetics LLC Messaging Terms and Conditions** sections are visible without login.
5. Submit a test contact lead with informational consent only. In Sanity, confirm the lead records:
   `informational: true`, `marketing: false`, `declined: false`, `recordedAt`,
   `disclosureVersion: grasshopper-toll-free-2026-07-26`, `method: website-form`, and the terms URL.
6. Repeat with “No” selected and confirm the form still submits while all positive SMS permissions
   remain false.

Do not upload a localhost screenshot to Grasshopper. The evidence must show the deployed public
page and match the URL entered in the application.

### Operating rules after approval

- Send only the category the contact selected. Informational consent does not authorize marketing.
- Send the confirmation message when a contact opts in. If no initial message is sent within
  30 days, reconfirm consent with a double opt-in before messaging.
- Honor STOP, CANCEL, END, QUIT, UNSUBSCRIBE, and any plain-language opt-out received by text,
  phone, or email. Remove the number from every associated messaging list; do not attempt another
  message unless the person opts in again.
- Respond to HELP with House of Rose Aesthetics LLC identification, `info@houseofrosefl.com`, and
  `(844) 941-7673`.
- Never buy, sell, rent, share, or import consent from another list or unrelated business purpose.
- Keep the displayed opt-in wording, application description, and actual messaging use aligned.
- Do not send a free, discounted, or credited health-service offer by SMS unless the exact Florida
  § 456.062 disclosure is included in that same message and the content has passed the
  `docs/GOVERNANCE/internal_only/compliance/` review gate. House of Rose's default is not to send discount messaging.

### Final submission gate

- [ ] Website changes deployed.
- [ ] Public contact page returns `200` at the trailing-slash URL.
- [ ] Public privacy policy returns `200` and contains the carrier-required language.
- [ ] Evidence PNG captured from the deployed contact page and under 5 MB.
- [ ] Informational-only and decline test submissions verified in Sanity.
- [ ] Grasshopper confirmation message configured exactly as shown above.
- [ ] STOP/HELP behavior tested from a real mobile number.
- [ ] EIN and legal name matched to the IRS record.
- [ ] Application description matches the live messaging program.

### Primary carrier/platform references checked

- [Grasshopper sample messaging privacy policy](https://support.grasshopper.com/download/gh-sample-privacy-policy)
- [Grasshopper sample messaging terms and conditions](https://support.grasshopper.com/download/gh-sample-terms-and-conditions)
- [T-Mobile Code of Conduct for messaging registration](https://support.goto.com/download/tmobile-code-of-conduct-guidelines-for-sms-registration-pdf)

Re-check these sources and the live Grasshopper form when renewing or changing the campaign because
carrier and aggregator requirements can change.
