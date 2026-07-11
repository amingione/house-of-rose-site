/**
 * Shippo — called over plain REST with fetch rather than the SDK.
 *
 * The SDK has churned through breaking majors (auth header shape, response
 * envelopes) and we use exactly three endpoints. A thin typed wrapper is less
 * code than the dependency and can't break under us on an npm install.
 */

const SHIPPO_API = 'https://api.goshippo.com';

export interface ShippoAddress {
  name: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone?: string;
  email?: string;
}

export interface ShippoRate {
  object_id: string;
  amount: string; // dollars, as a decimal string
  currency: string;
  provider: string; // "USPS"
  servicelevel: { name: string; token: string };
  estimated_days: number | null;
  duration_terms: string | null;
}

export interface ShippoTransaction {
  object_id: string;
  status: 'SUCCESS' | 'ERROR' | 'QUEUED' | 'WAITING';
  label_url: string | null;
  tracking_number: string | null;
  tracking_url_provider: string | null;
  messages?: Array<{ text: string }>;
}

/** Ship-from: the studio. Overridable by env so a move doesn't need a deploy. */
export const shipFrom: ShippoAddress = {
  name: process.env.SHIP_FROM_NAME ?? 'House of Rose Aesthetics',
  street1: process.env.SHIP_FROM_STREET1 ?? '525 E Olympia Ave',
  street2: process.env.SHIP_FROM_STREET2 ?? 'Unit 9',
  city: process.env.SHIP_FROM_CITY ?? 'Punta Gorda',
  state: process.env.SHIP_FROM_STATE ?? 'FL',
  zip: process.env.SHIP_FROM_ZIP ?? '33950',
  country: 'US',
  phone: process.env.SHIP_FROM_PHONE ?? '+18449417673',
  email: process.env.SHIP_FROM_EMAIL ?? 'info@houseofrosefl.com',
};

async function shippo<T>(path: string, body: unknown): Promise<T> {
  const token = process.env.SHIPPO_API_KEY;
  if (!token) throw new Error('SHIPPO_API_KEY is not set.');

  const res = await fetch(`${SHIPPO_API}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `ShippoToken ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Shippo ${path} failed (${res.status}): ${await res.text()}`);
  }
  return (await res.json()) as T;
}

/**
 * Pick a box for the order.
 *
 * Deliberately crude: three tiers by weight. Dimensional weight barely matters for
 * skincare (dense bottles in small boxes), so weight is the honest driver of cost.
 * Upgrade to real box-packing only if the rates start looking wrong.
 */
function parcelFor(weightOz: number): Record<string, string> {
  const tiers = [
    { max: 16, length: '6', width: '6', height: '4' },
    { max: 48, length: '10', width: '8', height: '6' },
    { max: Infinity, length: '14', width: '12', height: '8' },
  ];
  const box = tiers.find((t) => weightOz <= t.max) ?? tiers[tiers.length - 1];
  return {
    length: box.length,
    width: box.width,
    height: box.height,
    distance_unit: 'in',
    weight: Math.max(weightOz, 1).toFixed(2),
    mass_unit: 'oz',
  };
}

export interface ShipmentQuote {
  rates: ShippoRate[];
}

export async function getRates(to: ShippoAddress, weightOz: number): Promise<ShippoRate[]> {
  const shipment = await shippo<ShipmentQuote & { messages?: Array<{ text: string }> }>(
    '/shipments/',
    {
      address_from: shipFrom,
      address_to: to,
      parcels: [parcelFor(weightOz)],
      async: false, // block until rates are ready — we're mid-checkout
    },
  );

  const rates = shipment.rates ?? [];
  if (rates.length === 0) {
    throw new Error(
      `Shippo returned no rates: ${shipment.messages?.map((m) => m.text).join('; ') ?? 'unknown'}`,
    );
  }

  // Cheapest first, then cap the list. A checkout with nine shipping options is a
  // checkout that doesn't convert.
  return rates
    .slice()
    .sort((a, b) => Number(a.amount) - Number(b.amount))
    .slice(0, 3);
}

/**
 * Re-read a rate by id.
 *
 * This is the trust boundary for shipping cost: the browser tells us WHICH rate the
 * customer picked, and we ask Shippo what that rate actually costs. The client never
 * gets to name a shipping price.
 */
export async function getRate(rateId: string): Promise<ShippoRate> {
  const token = process.env.SHIPPO_API_KEY;
  if (!token) throw new Error('SHIPPO_API_KEY is not set.');

  const res = await fetch(`${SHIPPO_API}/rates/${encodeURIComponent(rateId)}`, {
    headers: { Authorization: `ShippoToken ${token}` },
  });
  if (!res.ok) {
    throw new Error(`Shippo rate lookup failed (${res.status}): ${await res.text()}`);
  }
  return (await res.json()) as ShippoRate;
}

/** Buy the label. Called from the webhook AFTER the money is captured. */
export async function buyLabel(rateId: string): Promise<ShippoTransaction> {
  return shippo<ShippoTransaction>('/transactions/', {
    rate: rateId,
    label_file_type: 'PDF_4x6',
    async: false,
  });
}

export const dollarsToCents = (amount: string): number => Math.round(Number(amount) * 100);
