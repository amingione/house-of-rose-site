import Link from "next/link";

import { StickySiteHeader } from "@/components/StickySiteHeader";
import { TrackedLink } from "@/components/TrackedLink";

type SiteChromeProps = {
  brandName: string;
  primaryCtaHref: string;
  primaryCtaLabel: string;
  phone: string;
  email: string;
};

export function SiteHeader({
  brandName,
  primaryCtaHref,
  primaryCtaLabel,
}: Pick<SiteChromeProps, "brandName" | "primaryCtaHref" | "primaryCtaLabel">) {
  const navItems = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/services/collections", label: "Service Houses" },
    { href: "/experience", label: "Experience" },
  ];

  return (
    <StickySiteHeader
      brandName={brandName}
      primaryCtaHref={primaryCtaHref}
      primaryCtaLabel={primaryCtaLabel}
      navItems={navItems}
    />
  );
}

export function SiteFooter({
  brandName,
  phone,
  email,
  primaryCtaHref,
  primaryCtaLabel,
}: SiteChromeProps) {
  return (
    <footer className="lux-footer">
      <div className="shell lux-footer-grid">
        <div>
          <p className="lux-kicker">{brandName}</p>
          <h2>Quiet luxury aesthetics with consultation-led care.</h2>
          <p>
            A polished studio experience for women who want naturally refined outcomes
            and thoughtful treatment planning.
          </p>
        </div>
        <div className="lux-footer-links">
          <Link href="/services">All Services</Link>
          <Link href="/services/collections">Service Houses</Link>
          <Link href="/experience">Guest Experience</Link>
          <TrackedLink
            href={`tel:${phone.replace(/[^\d+]/g, "")}`}
            className="text-link"
            eventName="contact_intent"
            eventDetails={{ placement: "footer_phone" }}
          >
            {phone}
          </TrackedLink>
          <TrackedLink
            href={`mailto:${email}`}
            className="text-link"
            eventName="contact_intent"
            eventDetails={{ placement: "footer_email" }}
          >
            {email}
          </TrackedLink>
        </div>
        <div className="lux-footer-cta">
          <p>Ready for a private consultation?</p>
          <TrackedLink
            href={primaryCtaHref}
            className="lux-btn lux-btn-secondary"
            eventName="book_cta_click"
            eventDetails={{ placement: "footer" }}
          >
            {primaryCtaLabel}
          </TrackedLink>
        </div>
      </div>
    </footer>
  );
}
