import Link from "next/link";

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
  return (
    <header className="lux-header">
      <div className="shell lux-header-inner">
        <Link href="/" className="lux-brand-mark">
          {brandName}
        </Link>
        <nav aria-label="Primary">
          <ul className="lux-nav">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/services">Services</Link>
            </li>
            <li>
              <Link href="/services/collections">Service Houses</Link>
            </li>
            <li>
              <Link href="/experience">Experience</Link>
            </li>
          </ul>
        </nav>
        <TrackedLink
          href={primaryCtaHref}
          className="lux-btn lux-btn-primary"
          eventName="book_cta_click"
          eventDetails={{ placement: "header" }}
        >
          {primaryCtaLabel}
        </TrackedLink>
      </div>
    </header>
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
