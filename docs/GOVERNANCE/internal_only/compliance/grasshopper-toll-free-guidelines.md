# H of R - Grasshopper Toll Free Registration
---
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

Grasshopper LogoHelp Sign Out
Toll-Free Registration
Toll-Free Registration
To send text messages from toll-free numbers, carriers need details about your business, the messages you plan to send and how you get permission to text your contacts. This is required even if you do not send marketing or promotional messages and only use texting for 1:1 conversations with your contacts. For additional guidance, see our user guide.

Your Business Information
How You Use Messaging
Messaging Consent and Privacy
Privacy Policy

https://houseofrosefl.com/privacy-policy/
Privacy policy is required for registration and must contain the content in the blue box below. Share a link to your policy on your website or on a file sharing site.


I acknowledge that the data sharing disclosures and messaging terms and conditions content shown below are required for toll free verification registration, and I have added them to my privacy policy.


Data Sharing
• Customer data is not shared with 3rd parties for promotional or marketing purposes.
• Mobile opt-in and consent are never shared with anyone for any purpose. Any information sharing that may be mentioned elsewhere in this policy excludes mobile opt-in data.
House of Rose Aesthetics LLC Messaging Terms and Conditions
1. The messaging program consists of general conversational messaging to answer questions and provide support to customers, as well as promotional messages about our products/services when separately consented to.
2. You can cancel the SMS service at any time. Just text 'STOP' to the phone number from which you received messages. After you send the SMS message 'STOP' to us, we will send you an SMS message to confirm that you have been unsubscribed. After this, you will no longer receive SMS messages from us. If you want to join again, just sign up as you did the first time and we will start sending SMS messages to you again.
3. If you are experiencing issues with the messaging program you can reply with the keyword HELP for more assistance, or you can get help directly at info@houseofrosefl.com.
4. Carriers are not liable for delayed or undelivered messages.
5. As always, message and data rates may apply for any messages sent to you from us and to us from you. Message frequency will vary based on communication needs. If you have any questions about your text plan or data plan, it is best to contact your wireless provider.
6. If you have any questions regarding privacy, please read our privacy policy contained in the rest of this document/page.

How do you get permission to message your contacts?


Via a form on my website: Contacts provide their phone number and check a box to opt in to messaging
https://houseofrosefl.com/contact
You must also upload a screenshot of the page where opt-in occurs, using the 'Evidence' field below.


I acknowledge that the following opt-in disclosure shown below is required for toll free verification registration, and I have added them to my opt-in process.

Contact Us

Name: ____________________________________________
Email: ___________________________________________
Phone Number: ____________________________________
Message: ____________________________________

House of Rose Aesthetics LLC would like your consent to send informational and/or marketing text message communications from +18449417673 to your mobile number listed above. Informational messages may include responses to messages you send us, as well as information relevant to your relationship with us. Marketing messages may include announcements, event information, or texts promoting our products/services.

Consent is not a condition of purchase. Message frequency varies. Message and data rates may apply. Reply 'STOP' to unsubscribe at any time. Reply 'HELP' for assistance or more information.

We do not share your mobile opt-in information with anyone. Our privacy policy and messaging terms and conditions are available at https://houseofrosefl.com/privacy-policy/ for more information.

☐ Yes, I consent to receive informational messages from House of Rose Aesthetics LLC
☐ Yes, I consent to receive marketing text messages from House of Rose Aesthetics LLC
☐ No, I do not want to receive any text messages from House of Rose Aesthetics LLC


Via a paper form

Keyword text: Contacts text a keyword to my Grasshopper number
Describe your opt-in process

Contacts opt in on our website contact page at https://houseofrosefl.com/contact/ by checking a box to agree to receive informational, marketing messages from House of Rose Aesthetics LLC. Message types, frequency and rates, as well help and opt-out instructions are disclosed. We confirm that no mobile opt-in info is shared with 3rd parties, and provide a link to our combined privacy policy and messaging terms and conditions.
Describe how contacts can agree or decline to get texts, and share a link to the relevant web page

Evidence

x
View image
provided
Provide proof of your opt-in process. (JPEG or PNG, max 5MB)
Upload evidence of your opt-in process (required for all opt-in methods), and your privacy policy (only required if your privacy policy is not available online)
Confirmation Messages
Opt In Messaging

Thank you for opting in to receive messages from House of Rose Aesthetics LLC. Msg frequency varies. Msg & data rates may apply. Reply HELP for help. Reply STOP to opt - out.
Confirmation message your contacts will receive after opting in
Review Application


I have verified my toll free registration information and confirm it is correct.
* Failure to obtain express end-user consent (opt-in) or respect the end-user’s right to revoke consent (opt-out) will result in carrier rejection of your submission. Consent cannot be purchased as a list from a third party. Consent cannot be obtained by virtue of an existing business relationship for other purposes unrelated to text messaging, or from consent given for text messaging of a different use case.
* While opt-out functionality is enforced at the Network level through the STOP and UNSTOP keywords, brands must act upon every opt-out event they receive by removing the opted-out consumer phone number from all distribution lists associated with the messaging program. No future messages may be attempted.
Cancel
©2026 Grasshopper | Support | Terms & Conditions | Privacy Policy
