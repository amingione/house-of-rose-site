#!/usr/bin/env node
/**
 * Visual Editing — scaffolder.
 *
 * Generates pre-annotated pages/components so anything new is wired for
 * click-to-edit the moment it's created — and, for a new page type, registers
 * its route in PAGE_ROUTES (stackbit.config.ts) automatically.
 *
 * Usage:
 *   npm run ve:new -- component <Name>
 *   npm run ve:new -- page --type <sanityType> --route /things/[slug] --query THING_BY_SLUG_QUERY
 *
 * Examples:
 *   npm run ve:new -- component PromoBanner
 *   npm run ve:new -- page --type offer --route /offers/[slug] --query OFFER_BY_SLUG_QUERY
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const WEB_SRC = path.join(ROOT, 'packages/web/src');
const CONFIG = path.join(ROOT, 'stackbit.config.ts');

const [kind, ...rest] = process.argv.slice(2);

function flag(name) {
  const i = rest.indexOf(`--${name}`);
  return i !== -1 ? rest[i + 1] : undefined;
}

function writeFile(file, contents) {
  if (existsSync(file)) {
    console.error(`✋ Refusing to overwrite existing file: ${path.relative(ROOT, file)}`);
    process.exit(1);
  }
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, contents);
  console.log(`✅ created ${path.relative(ROOT, file)}`);
}

if (kind === 'component') {
  const name = rest[0];
  if (!name || !/^[A-Z][A-Za-z0-9]+$/.test(name)) {
    console.error('Usage: npm run ve:new -- component <PascalCaseName>');
    process.exit(1);
  }
  const file = path.join(WEB_SRC, 'components', `${name}.astro`);
  writeFile(
    file,
    `---
/**
 * ${name} — pre-wired for Visual Editor click-to-edit.
 *
 * Pass the parent document's _id via \`sbObjectId\`, or rely on an ancestor
 * element already carrying \`data-sb-object-id\`. Field paths are RELATIVE to the
 * nearest ancestor object id and must match the Sanity schema field names.
 */
import { sbFieldPath } from "@/lib/visualEditing";

interface Props {
  title: string;
  description?: string;
  /** Field path of this block within its parent doc, e.g. "blocks[_key==\\"abc\\"]". */
  fieldPrefix?: string;
}

const { title, description, fieldPrefix } = Astro.props;
const fp = (field: string) => (fieldPrefix ? \`\${fieldPrefix}.\${field}\` : field);
---

<section>
  <h2 {...sbFieldPath(fp("title"))}>{title}</h2>
  {description && <p {...sbFieldPath(fp("description"))}>{description}</p>}
  <slot />
</section>
`,
  );
  console.log('\nNext: render it from a Sanity-backed page inside an element that has sbObjectId(_id).');
  process.exit(0);
}

if (kind === 'page') {
  const type = flag('type');
  const route = flag('route'); // e.g. /offers/[slug]
  const query = flag('query'); // e.g. OFFER_BY_SLUG_QUERY
  const slugsQuery = flag('slugsQuery') || `ALL_${(type || '').toUpperCase()}_SLUGS_QUERY`;
  if (!type || !route || !query) {
    console.error('Usage: npm run ve:new -- page --type <sanityType> --route /things/[slug] --query THING_BY_SLUG_QUERY [--slugsQuery ALL_THING_SLUGS_QUERY]');
    process.exit(1);
  }
  const urlPath = '/' + route.replace(/^\//, '').replace(/\[[^\]]+\]/g, '{slug}');
  const file = path.join(WEB_SRC, 'pages', route.replace(/^\//, '') + '.astro');

  writeFile(
    file,
    `---
import BaseLayout from "@/layouts/BaseLayout.astro";
import { sanityFetch } from "@/lib/sanity";
import { sbObjectId, sbFieldPath } from "@/lib/visualEditing";
import { ${query} } from "@/lib/queries";

export async function getStaticPaths() {
  const { ${slugsQuery} } = await import("@/lib/queries");
  const { sanityFetch } = await import("@/lib/sanity");
  const slugs = await sanityFetch<Array<{ slug: string }>>(${slugsQuery});
  return slugs.filter((s) => s.slug).map((s) => ({ params: { slug: s.slug } }));
}

const { slug } = Astro.params;
// NOTE: add \`_id\` to ${query}'s projection (it should already be there) so the
// object-id annotation below resolves to a real Sanity document.
const doc = await sanityFetch<{ _id: string; title: string; description?: string }>(${query}, { slug });
if (!doc) return Astro.redirect("/404");
---

<BaseLayout title={doc.title}>
  <article {...sbObjectId(doc._id)}>
    <h1 {...sbFieldPath("title")}>{doc.title}</h1>
    {doc.description && <p {...sbFieldPath("description")}>{doc.description}</p>}
  </article>
</BaseLayout>
`,
  );

  // Register the new page type in PAGE_ROUTES.
  const configSrc = readFileSync(CONFIG, 'utf8');
  const block = configSrc.match(/const PAGE_ROUTES[^{]*\{([\s\S]*?)\n\};/);
  if (block && !new RegExp(`\\b${type}\\s*:`).test(block[1])) {
    const updatedInner = block[1].replace(/\n*$/, '') + `\n  ${type}: '${urlPath}',\n`;
    writeFileSync(CONFIG, configSrc.replace(block[1], updatedInner));
    console.log(`✅ registered PAGE_ROUTES.${type} = '${urlPath}' in stackbit.config.ts`);
  } else {
    console.log(`ℹ️  PAGE_ROUTES.${type} already present — left as-is.`);
  }
  console.log('\nNext: ensure the Sanity schema "' + type + '" exists & is deployed, then fill in the page fields.');
  process.exit(0);
}

console.error('Usage:\n  npm run ve:new -- component <Name>\n  npm run ve:new -- page --type <t> --route /x/[slug] --query X_BY_SLUG_QUERY');
process.exit(1);
