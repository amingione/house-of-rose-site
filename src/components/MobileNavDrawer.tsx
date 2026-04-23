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
      data-mobile-nav-drawer
      data-open="false"
      aria-hidden="true"
    >
      <button
        type="button"
        className="lux-mobile-nav-backdrop"
        aria-label="Close navigation menu"
        data-mobile-nav-close
      />
      <div className="lux-mobile-nav-panel">
        <div className="lux-mobile-nav-topline">
          <span className="lux-kicker">Navigate</span>
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
