import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const files = {
  contact: 'packages/web/src/pages/contact.astro',
  privacy: 'packages/web/src/pages/privacy-policy.astro',
  publicCopy: 'packages/web/src/lib/publicCopy.ts',
  handler: 'packages/web/netlify/functions/lead-submit.ts',
  schema: 'packages/studio/schemas/leadSubmission.ts',
  runbook: 'docs/GOVERNANCE/internal_only/compliance/grasshopper-toll-free-guidelines.md',
};

const sources = Object.fromEntries(
  await Promise.all(
    Object.entries(files).map(async ([key, path]) => [
      key,
      await readFile(resolve(root, path), 'utf8'),
    ]),
  ),
);

const checks = [
  ['contact', 'name="consent-informational"'],
  ['contact', 'name="consent-marketing"'],
  ['contact', 'name="consent-none"'],
  ['contact', 'Consent is not a condition of purchase.'],
  ['contact', "Reply 'STOP' to unsubscribe at any time."],
  ['contact', "Reply 'HELP' for assistance or more information."],
  ['contact', 'https://houseofrosefl.com/privacy-policy/'],
  ['privacy', 'Customer data is not shared with 3rd parties for promotional or marketing purposes.'],
  ['privacy', 'Mobile opt-in and consent are never shared with anyone for any purpose.'],
  ['privacy', 'House of Rose Aesthetics LLC Messaging Terms and Conditions'],
  ['privacy', '!heading.endsWith("messaging terms and conditions")'],
  ['privacy', 'alignPublicChannelCopy'],
  ['publicCopy', '.replaceAll("House of Rose LLC", "House of Rose Aesthetics LLC")'],
  ['privacy', "Just text 'STOP' to the phone number from which you received messages."],
  ['privacy', 'Carriers are not liable for delayed or undelivered messages.'],
  ['privacy', 'Message frequency will vary based on communication needs.'],
  ['handler', "const SMS_DISCLOSURE_VERSION = 'grasshopper-toll-free-2026-07-26';"],
  ['handler', "method: 'website-form'"],
  ['handler', 'Text-message consent choices conflict. Choose consent or decline.'],
  ['schema', "name: 'recordedAt'"],
  ['schema', "name: 'disclosureVersion'"],
  ['schema', "name: 'method'"],
  ['schema', "name: 'termsUrl'"],
  ['runbook', 'https://houseofrosefl.com/contact/'],
  ['runbook', 'https://houseofrosefl.com/privacy-policy/'],
];

const failures = checks.filter(([file, text]) => !sources[file].includes(text));

if (failures.length) {
  console.error('Grasshopper compliance verification failed:');
  failures.forEach(([file, text]) => console.error(`- ${files[file]} is missing: ${text}`));
  process.exitCode = 1;
} else {
  console.log(`Grasshopper compliance verification passed (${checks.length} checks).`);
}
