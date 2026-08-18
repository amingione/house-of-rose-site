import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const DIST_DIR = path.resolve('packages/web/dist');
const ACTIVE_MENU_URL = 'https://houseofrose.glossgenius.com/services';
const ACTIVE_BOOKING_PREFIX = 'https://houseofrose.glossgenius.com/book?';
const RETIRED_PATHS = new Set([
  '/aundrea/',
  '/services/professional-makeup/',
]);

const failures = [];

async function collectHtml(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const fullPath = path.join(directory, entry.name);
      return entry.isDirectory()
        ? collectHtml(fullPath)
        : Promise.resolve(entry.name.endsWith('.html') ? [fullPath] : []);
    }),
  );
  return files.flat();
}

function getAttribute(tag, name) {
  const match = tag.match(new RegExp(`\\s${name}(?:=["']([^"']*)["'])?(?=\\s|>)`, 'i'));
  return match ? (match[1] ?? '') : undefined;
}

function isRouteHref(href) {
  if (!href.startsWith('/') || href.startsWith('//')) return false;
  const pathname = href.split(/[?#]/, 1)[0];
  if (pathname === '/' || pathname.startsWith('/_') || pathname.startsWith('/.netlify/')) return false;
  return !/\.[a-z0-9]{2,8}$/i.test(pathname);
}

for (const file of await collectHtml(DIST_DIR)) {
  const html = await readFile(file, 'utf8');
  const route = `/${path.relative(DIST_DIR, file).replace(/index\.html$/, '').replace(/\\/g, '/')}`;

  for (const tag of html.match(/<a\b[^>]*>/gi) ?? []) {
    const href = getAttribute(tag, 'href');
    if (!href) continue;
    const hrefPath = href.split(/[?#]/, 1)[0];

    // Match retired routes exactly. `/aundrea/` is the retired digital-card
    // root; `/about/providers/aundrea/` is the current provider profile.
    if (RETIRED_PATHS.has(hrefPath)) {
      failures.push(`${route}: reintroduced retired path ${hrefPath}`);
    }

    if (isRouteHref(href) && !href.split(/[?#]/, 1)[0].endsWith('/')) {
      failures.push(`${route}: internal route is missing its trailing slash: ${href}`);
    }

    const serviceSlug = getAttribute(tag, 'data-booking-service');
    if (serviceSlug !== undefined) {
      const mode = getAttribute(tag, 'data-booking-mode');
      const location = getAttribute(tag, 'data-cta-location');
      const isPhone = mode === 'phone' && href === 'tel:+19414000165';
      const isExact =
        (mode === 'direct' || mode === 'consultation') &&
        href.startsWith(ACTIVE_BOOKING_PREFIX) &&
        new URL(href).searchParams.has('service_token');
      if (!isPhone && !isExact) {
        failures.push(`${route}: ${serviceSlug} has an invalid contextual ${mode} action: ${href}`);
      }
      if (!location) failures.push(`${route}: ${serviceSlug} is missing a CTA location`);
      if (href === ACTIVE_MENU_URL) {
        failures.push(`${route}: ${serviceSlug} silently falls back to the generic menu`);
      }
    }

    if (href === ACTIVE_MENU_URL && getAttribute(tag, 'data-global-booking') === undefined) {
      failures.push(`${route}: generic menu is used outside an explicitly global Book action`);
    }
  }
}

if (failures.length) {
  console.error(`Booking/link verification failed with ${failures.length} issue(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log('Booking/link verification passed for every built HTML route.');
}
