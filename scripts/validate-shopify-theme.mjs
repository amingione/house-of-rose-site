import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';

const themeRoot = resolve(process.argv[2] ?? 'packages/shopify-theme');
const failures = [];
const requiredDirectories = ['assets', 'config', 'layout', 'locales', 'sections', 'snippets', 'templates'];
const requiredFiles = ['layout/theme.liquid', 'templates/index.json', 'config/settings_schema.json', 'config/settings_data.json'];

const filesIn = (directory) => {
  const absolute = join(themeRoot, directory);
  if (!existsSync(absolute)) return [];
  return readdirSync(absolute, { withFileTypes: true }).flatMap((entry) => {
    const relative = join(directory, entry.name);
    return entry.isDirectory() ? filesIn(relative) : [relative];
  });
};

for (const directory of requiredDirectories) {
  if (!existsSync(join(themeRoot, directory))) failures.push(`Missing directory: ${directory}`);
}
for (const file of requiredFiles) {
  if (!existsSync(join(themeRoot, file))) failures.push(`Missing required file: ${file}`);
}

const allFiles = requiredDirectories.flatMap(filesIn);
const jsonFiles = allFiles.filter((file) => extname(file) === '.json');
const liquidFiles = allFiles.filter((file) => extname(file) === '.liquid');
const sectionTypes = new Set(filesIn('sections').filter((file) => file.endsWith('.liquid')).map((file) => file.split('/').pop().replace(/\.liquid$/, '')));
const snippetTypes = new Set(filesIn('snippets').filter((file) => file.endsWith('.liquid')).map((file) => file.split('/').pop().replace(/\.liquid$/, '')));
const assetNames = new Set(filesIn('assets').map((file) => file.split('/').pop()));

for (const file of jsonFiles) {
  try {
    const data = JSON.parse(readFileSync(join(themeRoot, file), 'utf8'));
    if (file.startsWith('templates/') || file.endsWith('-group.json')) {
      for (const [id, section] of Object.entries(data.sections ?? {})) {
        if (!sectionTypes.has(section.type)) failures.push(`${file}: section "${id}" references missing type "${section.type}"`);
      }
    }
  } catch (error) {
    failures.push(`${file}: invalid JSON (${error.message})`);
  }
}

for (const file of filesIn('sections').filter((item) => item.endsWith('.liquid'))) {
  const source = readFileSync(join(themeRoot, file), 'utf8');
  const match = source.match(/{%\s*schema\s*%}([\s\S]*?){%\s*endschema\s*%}/);
  if (!match) {
    failures.push(`${file}: missing schema block`);
    continue;
  }
  try {
    const schema = JSON.parse(match[1]);
    if (!schema.name || typeof schema.name !== 'string') failures.push(`${file}: schema is missing a name`);
    if (schema.name?.length > 25) failures.push(`${file}: schema name exceeds Shopify's 25-character limit`);
  } catch (error) {
    failures.push(`${file}: invalid section schema JSON (${error.message})`);
  }
}

for (const file of liquidFiles) {
  const source = readFileSync(join(themeRoot, file), 'utf8');
  for (const match of source.matchAll(/{%\s*render\s+['"]([^'"]+)['"]/g)) {
    if (!snippetTypes.has(match[1])) failures.push(`${file}: renders missing snippet "${match[1]}"`);
  }
  for (const match of source.matchAll(/['"]([^'"]+)['"]\s*\|\s*asset_url/g)) {
    if (!assetNames.has(match[1])) failures.push(`${file}: references missing asset "${match[1]}"`);
  }
}

const settings = readFileSync(join(themeRoot, 'config/settings_data.json'), 'utf8');
for (const canonical of ['525 E Olympia Ave, Unit 9', '(844) 941-7673', '+18449417673', 'info@houseofrosefl.com']) {
  if (!settings.includes(canonical)) failures.push(`settings_data.json is missing canonical business value: ${canonical}`);
}

if (failures.length) {
  console.error(`Shopify theme validation failed with ${failures.length} issue${failures.length === 1 ? '' : 's'}:`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Shopify theme validation passed: ${allFiles.length} files, ${jsonFiles.length} JSON documents, ${sectionTypes.size} sections, and ${snippetTypes.size} snippets.`);
