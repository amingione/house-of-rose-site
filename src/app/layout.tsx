import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";

import "./globals.css";

const headingFont = Cormorant_Garamond({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const bodyFont = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "House of Rose | Luxury Med Spa in Punta Gorda",
    template: "%s | House of Rose",
  },
  description:
    "Boutique aesthetics and wellness studio in Punta Gorda, FL offering injectables, ProCell microchanneling, permanent makeup, permanent jewelry, PRP rejuvenation, GLP-1 wellness support, and hydration therapy.",
  openGraph: {
    title: "House of Rose | Luxury Med Spa in Punta Gorda",
    description:
      "Quiet luxury aesthetics with consultation-first treatment planning and refined, natural-looking outcomes.",
    type: "website",
    locale: "en_US",
    siteName: "House of Rose",
    images: [
      {
        url: "/inspo/reception-marble.png",
        width: 1200,
        height: 630,
        alt: "House of Rose studio atmosphere",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "House of Rose | Luxury Med Spa in Punta Gorda",
    description:
      "Boutique aesthetics and wellness treatments in Punta Gorda, Florida.",
    images: ["/inspo/reception-marble.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${headingFont.variable} ${bodyFont.variable} smooth-scroll`}
    >
      <body>{children}</body>
    </html>
  );
}
