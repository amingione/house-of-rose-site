import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { contactPage } from "../packages/studio/schemas/contactPage.ts";

test("the disconnected Contact singleton remains source-compatible without presenting fields as live controls", () => {
  const expectedFields = [
    "seoTitle",
    "seoDescription",
    "heroKicker",
    "heroTitle",
    "heroDescription",
    "phoneLabel",
    "phoneNumber",
    "phoneHours",
    "bookLabel",
    "bookLinkText",
    "bookNote",
    "visitLabel",
    "addressLine1",
    "addressLine2",
    "formKicker",
    "formHeading",
    "formIntro",
    "mapKicker",
    "mapHeading",
    "mapCtaText",
  ];

  assert.deepEqual(
    contactPage.fields.map((field) => field.name),
    expectedFields,
  );

  for (const field of contactPage.fields) {
    assert.equal(
      field.readOnly,
      true,
      `${field.name} must remain source-compatible but read-only.`,
    );
    assert.match(
      String(field.title),
      /not published/i,
      `${field.name} must be labeled accurately.`,
    );
    assert.match(String(field.description), /current \/contact\/ route uses/i);
  }
});

test("Contact Studio groups state the current publication boundary", () => {
  for (const group of contactPage.groups ?? []) {
    assert.match(String(group.title), /not published/i);
  }
});

test("the public Contact route does not fetch the disconnected Studio singleton", () => {
  const route = readFileSync(
    new URL("../packages/web/src/pages/contact.astro", import.meta.url),
    "utf8",
  );
  const queries = readFileSync(
    new URL("../packages/web/src/lib/queries.ts", import.meta.url),
    "utf8",
  );

  assert.doesNotMatch(route, /contactPage|sanityFetch|CONTACT_PAGE_QUERY/);
  assert.doesNotMatch(queries, /_type\s*==\s*["']contactPage["']/);
});
