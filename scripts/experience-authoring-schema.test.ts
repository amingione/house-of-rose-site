import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { experienceContent } from "../packages/studio/schemas/experienceContent.ts";

test("the disconnected Experience singleton preserves stored fields without editable publish controls", () => {
  const expectedFields = [
    "heroTitle",
    "heroSubtitle",
    "storyHeading",
    "storyParagraph1",
    "storyParagraph2",
    "storyImage",
    "standards",
    "journeySteps",
  ];

  assert.deepEqual(
    experienceContent.fields.map((field) => field.name),
    expectedFields,
  );

  for (const field of experienceContent.fields) {
    assert.equal(
      field.readOnly,
      true,
      `${field.name} must remain source-compatible but read-only.`,
    );
  }

  const storyImage = experienceContent.fields.find(
    (field) => field.name === "storyImage",
  );
  assert.match(String(storyImage?.title), /not published/i);
  assert.match(
    String(storyImage?.description),
    /current \/experience\/ route uses reviewed local photography/i,
  );
});

test("the public Experience route does not fetch the disconnected Studio singleton", () => {
  const route = readFileSync(
    new URL("../packages/web/src/pages/experience.astro", import.meta.url),
    "utf8",
  );
  const stackbit = readFileSync(
    new URL("../stackbit.config.ts", import.meta.url),
    "utf8",
  );
  const queries = readFileSync(
    new URL("../packages/web/src/lib/queries.ts", import.meta.url),
    "utf8",
  );

  assert.doesNotMatch(
    route,
    /experienceContent|EXPERIENCE_CONTENT_QUERY|sanityFetch/,
  );
  assert.match(route, /\/images\/optimized\/actual-welcome-800\.webp/);
  assert.match(
    route,
    /\/images\/optimized\/house-of-rose-storefront-700\.webp/,
  );
  assert.doesNotMatch(
    stackbit,
    /experienceContent:\s*["']\/experience["']/,
  );
  assert.doesNotMatch(
    queries,
    /EXPERIENCE_CONTENT_QUERY|interface ExperienceContent/,
  );
});
