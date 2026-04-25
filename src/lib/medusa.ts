import { getPackages } from "@/lib/medusa-client";
import { PackageHighlight, PackageResult } from "@/lib/types";

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

function toPackageHighlight(index: number, pkg: Awaited<ReturnType<typeof getPackages>>["packages"][number]): PackageHighlight {
  return {
    id: pkg.id || `pkg-${index + 1}`,
    title: pkg.title,
    subtitle: pkg.subtitle,
    priceLabel:
      pkg.calculatedAmount !== undefined
        ? formatPrice(pkg.calculatedAmount, pkg.currencyCode)
        : "Pricing shared during consultation",
    availabilityLabel: "Consultation required",
  };
}

export async function getPackageHighlights(): Promise<PackageResult> {
  const response = await getPackages(3);

  return {
    packages: response.packages.map((pkg, index) => toPackageHighlight(index, pkg)),
    fromMedusa: response.source === "medusa",
    source: response.source,
    notice: response.notice,
  };
}
