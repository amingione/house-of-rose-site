import Link from "next/link";

import { MobileNavDrawer } from "@/components/MobileNavDrawer";
import { TrackedLink } from "@/components/TrackedLink";

export type HeaderNavItem = {
  href: string;
  label: string;
};

type StickySiteHeaderProps = {
  brandName: string;
  primaryCtaHref: string;
  primaryCtaLabel: string;
  navItems: HeaderNavItem[];
};

const headerBehaviorScript = `
(() => {
  const w = window;
  const d = document;

  const getHeader = () => d.querySelector("[data-sticky-site-header]");
  const getDrawer = () => d.querySelector("[data-mobile-nav-drawer]");
  const getTrigger = () => d.querySelector("[data-mobile-nav-trigger]");
  const getScrollTop = () => Math.max(w.scrollY, d.documentElement.scrollTop, 0);

  const applyHeaderState = (scrollY) => {
    const header = getHeader();
    if (!(header instanceof HTMLElement)) {
      return;
    }

    header.dataset.headerState = scrollY > 48 ? "scrolled" : "over-hero";
    header.dataset.headerSize = scrollY > 96 ? "compact" : "full";
  };

  const setDrawerOpen = (open) => {
    const drawer = getDrawer();
    const trigger = getTrigger();
    if (!(drawer instanceof HTMLElement) || !(trigger instanceof HTMLElement)) {
      return;
    }

    drawer.dataset.open = String(open);
    drawer.setAttribute("aria-hidden", String(!open));
    trigger.dataset.open = String(open);
    trigger.setAttribute("aria-expanded", String(open));
    d.body.style.overflow = open ? "hidden" : "";
  };

  const syncHeader = () => applyHeaderState(getScrollTop());

  if (!w.__luxStickyHeaderInit) {
    let animationFrame = 0;

    const handleScroll = () => {
      w.cancelAnimationFrame(animationFrame);
      animationFrame = w.requestAnimationFrame(syncHeader);
    };

    d.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      if (target.closest("[data-mobile-nav-trigger]")) {
        event.preventDefault();
        const isOpen = getDrawer()?.getAttribute("data-open") === "true";
        setDrawerOpen(!isOpen);
        return;
      }

      if (
        target.closest("[data-mobile-nav-close]") ||
        target.closest("[data-mobile-nav-drawer] a")
      ) {
        setDrawerOpen(false);
      }
    });

    w.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setDrawerOpen(false);
      }
    });
    w.addEventListener("scroll", handleScroll, { passive: true });
    w.addEventListener("resize", handleScroll);

    w.__luxStickyHeaderInit = true;
  }

  setDrawerOpen(false);
  syncHeader();
})();
`;

export function StickySiteHeader({
  brandName,
  primaryCtaHref,
  primaryCtaLabel,
  navItems,
}: StickySiteHeaderProps) {
  return (
    <>
      <header
        className="lux-header"
        data-sticky-site-header
        data-header-state="over-hero"
        data-header-size="full"
      >
        <div className="shell lux-header-shell">
          <div className="lux-header-inner">
            <Link href="/" className="lux-brand-mark">
              {brandName}
            </Link>

            <nav aria-label="Primary" className="lux-desktop-nav">
              <ul className="lux-nav">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="lux-header-actions">
              <TrackedLink
                href={primaryCtaHref}
                className="lux-btn lux-btn-primary lux-header-cta"
                eventName="book_cta_click"
                eventDetails={{ placement: "header" }}
              >
                {primaryCtaLabel}
              </TrackedLink>
              <button
                type="button"
                className="lux-mobile-nav-trigger"
                aria-expanded="false"
                aria-controls="lux-mobile-nav-drawer"
                aria-label="Open navigation menu"
                data-mobile-nav-trigger
                data-open="false"
              >
                <span aria-hidden="true" className="lux-mobile-nav-trigger-lines">
                  <span />
                  <span />
                  <span />
                </span>
                <span className="lux-mobile-nav-trigger-label">Menu</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileNavDrawer
        id="lux-mobile-nav-drawer"
        brandName={brandName}
        navItems={navItems}
        primaryCtaHref={primaryCtaHref}
        primaryCtaLabel={primaryCtaLabel}
      />

      <script dangerouslySetInnerHTML={{ __html: headerBehaviorScript }} />
    </>
  );
}
