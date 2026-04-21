import { PackageHighlight, PackageResult } from "@/lib/types";

const fallbackPackages: PackageHighlight[] = [
  {
    id: "pkg-consult-1",
    title: "Injectables Signature Plan",
    subtitle: "Customized neuromodulator and filler strategy",
    priceLabel: "Pricing shared during consultation",
    availabilityLabel: "Consultation required",
  },
  {
    id: "pkg-consult-2",
    title: "Skin Renewal Series",
    subtitle: "ProCell + PRP protocol options",
    priceLabel: "Pricing shared during consultation",
    availabilityLabel: "Consultation required",
  },
  {
    id: "pkg-consult-3",
    title: "Wellness Reset Program",
    subtitle: "GLP-1 and hydration support planning",
    priceLabel: "Pricing shared during consultation",
    availabilityLabel: "Consultation required",
  },
];

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

function formatPrice(amount: number, currencyCode?: string): string {
  const normalizedCurrency = (currencyCode ?? "USD").toUpperCase();

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: normalizedCurrency,
      maximumFractionDigits: 0,
    }).format(amount / 100);
  } catch {
    return `$${Math.round(amount / 100)}`;
  }
}

function resolvePriceLabel(product: MedusaProduct): string {
  const variant = product.variants?.[0];

  if (variant?.calculated_price?.calculated_amount !== undefined) {
    return formatPrice(
      variant.calculated_price.calculated_amount,
      variant.calculated_price.currency_code,
    );
  }

  const firstPrice = variant?.prices?.[0];

  if (firstPrice?.amount !== undefined) {
    return formatPrice(firstPrice.amount, firstPrice.currency_code);
  }

  return "Pricing shared during consultation";
}

function productToPackage(product: MedusaProduct, index: number): PackageHighlight {
  return {
    id: product.id ?? `pkg-${index + 1}`,
    title: product.title ?? "Personalized Treatment Package",
    subtitle:
      product.subtitle ??
      (product.handle ? `Package: ${product.handle}` : "Customized clinical planning"),
    priceLabel: resolvePriceLabel(product),
    availabilityLabel: "Verified via Medusa",
  };
}

export async function getPackageHighlights(): Promise<PackageResult> {
  const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;

  if (!backendUrl) {
    return {
      packages: fallbackPackages,
      fromMedusa: false,
    };
  }

  const publishableKey = process.env.MEDUSA_PUBLISHABLE_API_KEY;

  try {
    const response = await fetch(`${backendUrl.replace(/\/$/, "")}/store/products?limit=3`, {
      headers: {
        "Content-Type": "application/json",
        ...(publishableKey ? { "x-publishable-api-key": publishableKey } : {}),
      },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return {
        packages: fallbackPackages,
        fromMedusa: false,
      };
    }

    const payload = (await response.json()) as MedusaProductsResponse;
    const products = payload.products ?? [];

    if (products.length === 0) {
      return {
        packages: fallbackPackages,
        fromMedusa: false,
      };
    }

    return {
      packages: products.slice(0, 3).map(productToPackage),
      fromMedusa: true,
    };
  } catch {
    return {
      packages: fallbackPackages,
      fromMedusa: false,
    };
  }
}
