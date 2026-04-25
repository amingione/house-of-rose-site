export type MedusaClientSource = "medusa" | "mock";

export type MedusaPackage = {
  id: string;
  title: string;
  subtitle: string;
  handle?: string;
  calculatedAmount?: number;
  currencyCode?: string;
};

type MedusaVariant = {
  calculated_price?: {
    calculated_amount?: number;
    currency_code?: string;
  };
  prices?: Array<{
    amount?: number;
    currency_code?: string;
  }>;
};

type MedusaProduct = {
  id?: string;
  title?: string;
  subtitle?: string;
  handle?: string;
  variants?: MedusaVariant[];
};

type MedusaProductsResponse = {
  products?: MedusaProduct[];
};

type MedusaQueryResult = {
  source: MedusaClientSource;
  packages: MedusaPackage[];
  notice?: string;
};

type MedusaRuntimeConfig = {
  backendUrl: string | null;
  publishableKey: string | null;
  requestTimeoutMs: number;
  mockMode: boolean;
  startupNotices: string[];
};

const DEFAULT_TIMEOUT_MS = 8000;
const MAX_TIMEOUT_MS = 30000;

const MOCK_PACKAGES: MedusaPackage[] = [
  {
    id: "mock-injectables-signature",
    title: "Injectables Signature Plan",
    subtitle: "Personalized neuromodulator and filler strategy",
    handle: "injectables-signature-plan",
    calculatedAmount: 45000,
    currencyCode: "USD",
  },
  {
    id: "mock-skin-renewal",
    title: "Skin Renewal Series",
    subtitle: "ProCell and regenerative support planning",
    handle: "skin-renewal-series",
    calculatedAmount: 38000,
    currencyCode: "USD",
  },
  {
    id: "mock-wellness-reset",
    title: "Wellness Reset Program",
    subtitle: "GLP-1 and hydration pathway design",
    handle: "wellness-reset-program",
    calculatedAmount: 32000,
    currencyCode: "USD",
  },
  {
    id: "mock-rejuvenation-plan",
    title: "Regenerative Rejuvenation Plan",
    subtitle: "PRP-led support for skin vitality goals",
    handle: "regenerative-rejuvenation-plan",
    calculatedAmount: 42000,
    currencyCode: "USD",
  },
];

const noticeCache = new Set<string>();

function logNoticeOnce(message: string) {
  if (noticeCache.has(message)) {
    return;
  }

  noticeCache.add(message);
  console.warn(`[Medusa] ${message}`);
}

function parseBooleanEnv(value: string | undefined): boolean {
  if (!value) {
    return false;
  }

  const normalized = value.trim().toLowerCase();
  return ["1", "true", "yes", "on"].includes(normalized);
}

function parseTimeout(value: string | undefined): number {
  if (!value) {
    return DEFAULT_TIMEOUT_MS;
  }

  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return DEFAULT_TIMEOUT_MS;
  }

  return Math.min(parsed, MAX_TIMEOUT_MS);
}

function getRuntimeConfig(): MedusaRuntimeConfig {
  const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL?.trim() || null;
  const publishableKey = process.env.MEDUSA_PUBLISHABLE_API_KEY?.trim() || null;
  const requestTimeoutMs = parseTimeout(process.env.MEDUSA_REQUEST_TIMEOUT_MS);
  const mockModeFromEnv = parseBooleanEnv(process.env.MEDUSA_MOCK_MODE);

  const startupNotices: string[] = [];

  if (!backendUrl && !mockModeFromEnv) {
    startupNotices.push(
      "NEXT_PUBLIC_MEDUSA_BACKEND_URL is missing. Falling back to local mock catalog. Set MEDUSA_MOCK_MODE=true to make this explicit.",
    );
  }

  if (backendUrl && !publishableKey) {
    startupNotices.push(
      "MEDUSA_PUBLISHABLE_API_KEY is not set. Some Medusa stores will reject requests without it.",
    );
  }

  if (
    process.env.MEDUSA_REQUEST_TIMEOUT_MS &&
    requestTimeoutMs === DEFAULT_TIMEOUT_MS &&
    process.env.MEDUSA_REQUEST_TIMEOUT_MS !== `${DEFAULT_TIMEOUT_MS}`
  ) {
    startupNotices.push(
      "MEDUSA_REQUEST_TIMEOUT_MS is invalid. Using default timeout of 8000ms.",
    );
  }

  const mockMode = mockModeFromEnv || !backendUrl;

  return {
    backendUrl,
    publishableKey,
    requestTimeoutMs,
    mockMode,
    startupNotices,
  };
}

const runtimeConfig = getRuntimeConfig();
for (const notice of runtimeConfig.startupNotices) {
  logNoticeOnce(notice);
}

function resolveAmount(variant?: MedusaVariant): {
  calculatedAmount?: number;
  currencyCode?: string;
} {
  if (variant?.calculated_price?.calculated_amount !== undefined) {
    return {
      calculatedAmount: variant.calculated_price.calculated_amount,
      currencyCode: variant.calculated_price.currency_code,
    };
  }

  const firstPrice = variant?.prices?.[0];

  if (firstPrice?.amount !== undefined) {
    return {
      calculatedAmount: firstPrice.amount,
      currencyCode: firstPrice.currency_code,
    };
  }

  return {};
}

function productToPackage(product: MedusaProduct, index: number): MedusaPackage {
  const price = resolveAmount(product.variants?.[0]);

  return {
    id: product.id ?? `medusa-product-${index + 1}`,
    title: product.title ?? "Personalized Treatment Package",
    subtitle:
      product.subtitle ??
      (product.handle ? `Package: ${product.handle}` : "Customized clinical planning"),
    handle: product.handle,
    calculatedAmount: price.calculatedAmount,
    currencyCode: price.currencyCode,
  };
}

async function fetchFromMedusa(limit: number): Promise<MedusaQueryResult> {
  if (!runtimeConfig.backendUrl) {
    return {
      source: "mock",
      packages: MOCK_PACKAGES.slice(0, limit),
      notice:
        "Medusa backend URL is not configured. Using local mock package catalog for development.",
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), runtimeConfig.requestTimeoutMs);

  try {
    const response = await fetch(
      `${runtimeConfig.backendUrl.replace(/\/$/, "")}/store/products?limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(runtimeConfig.publishableKey
            ? { "x-publishable-api-key": runtimeConfig.publishableKey }
            : {}),
        },
        next: { revalidate: 300 },
        signal: controller.signal,
      },
    );

    if (!response.ok) {
      const notice = `Medusa request failed with HTTP ${response.status}. Using mock package catalog.`;
      logNoticeOnce(notice);
      return {
        source: "mock",
        packages: MOCK_PACKAGES.slice(0, limit),
        notice,
      };
    }

    const payload = (await response.json()) as MedusaProductsResponse;
    const products = payload.products ?? [];

    if (products.length === 0) {
      const notice =
        "Medusa responded successfully but returned no products. Using mock package catalog.";
      logNoticeOnce(notice);
      return {
        source: "mock",
        packages: MOCK_PACKAGES.slice(0, limit),
        notice,
      };
    }

    return {
      source: "medusa",
      packages: products.slice(0, limit).map(productToPackage),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Medusa error";
    const notice = `Unable to reach Medusa (${message}). Using mock package catalog.`;
    logNoticeOnce(notice);

    return {
      source: "mock",
      packages: MOCK_PACKAGES.slice(0, limit),
      notice,
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function queryPackages(limit: number): Promise<MedusaQueryResult> {
  if (runtimeConfig.mockMode) {
    const notice = runtimeConfig.backendUrl
      ? "MEDUSA_MOCK_MODE is enabled. Using local mock package catalog."
      : "Running in mock mode because Medusa backend is not configured.";

    if (runtimeConfig.mockMode && process.env.MEDUSA_MOCK_MODE) {
      logNoticeOnce(notice);
    }

    return {
      source: "mock",
      packages: MOCK_PACKAGES.slice(0, limit),
      notice,
    };
  }

  return fetchFromMedusa(limit);
}

export async function getPackages(limit = 3): Promise<MedusaQueryResult> {
  return queryPackages(limit);
}

export async function getServiceCatalog(limit = 24): Promise<MedusaQueryResult> {
  return queryPackages(limit);
}

export async function getProductByHandle(handle: string): Promise<{
  source: MedusaClientSource;
  product: MedusaPackage | null;
  notice?: string;
}> {
  const response = await getServiceCatalog(100);
  const normalized = handle.trim().toLowerCase();

  return {
    source: response.source,
    notice: response.notice,
    product:
      response.packages.find(
        (item) => item.handle?.trim().toLowerCase() === normalized,
      ) ?? null,
  };
}
