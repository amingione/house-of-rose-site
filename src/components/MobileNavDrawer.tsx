import Link from "next/link";

import { TrackedLink } from "@/components/TrackedLink";
import type { HeaderNavItem } from "@/components/StickySiteHeader";

type MobileNavDrawerProps = {
  id: string;
  brandName: string;
  navItems: HeaderNavItem[];
  primaryCtaHref: string;
  primaryCtaLabel: string;
};

export function MobileNavDrawer({
  id,
  brandName,
  navItems,
  primaryCtaHref,
  primaryCtaLabel,
}: MobileNavDrawerProps) {
  return (
    <div
      id={id}
      className="lux-mobile-nav-drawer"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lux-mobile-nav-title"
      data-mobile-nav-drawer
      data-open="false"
      aria-hidden="true"
      hidden
    >
      <button
        type="button"
        className="lux-mobile-nav-backdrop"
        aria-label="Close menu"
        data-mobile-nav-close
        tabIndex={-1}
      />
      <div className="lux-mobile-nav-panel" data-mobile-nav-panel tabIndex={-1}>
        <div className="lux-mobile-nav-topline">
          <h2 id="lux-mobile-nav-title" className="lux-kicker">
            Site navigation
          </h2>
          <span className="lux-mobile-nav-brand">{brandName}</span>
        </div>

        <nav aria-label="Mobile primary">
          <ul className="lux-mobile-nav-list">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <TrackedLink
          href={primaryCtaHref}
          className="lux-btn lux-btn-primary lux-mobile-nav-cta"
          eventName="book_cta_click"
          eventDetails={{ placement: "mobile_header" }}
        >
          {primaryCtaLabel}
        </TrackedLink>
      </div>
    </div>
  );
}
