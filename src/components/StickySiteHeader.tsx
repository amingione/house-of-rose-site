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
  const desktopMinWidth = 841;
  const openMenuLabel = "Open menu";
  const closeMenuLabel = "Close menu";

  const getHeader = () => d.querySelector("[data-sticky-site-header]");
  const getDrawer = () => d.querySelector("[data-mobile-nav-drawer]");
  const getPanel = () => d.querySelector("[data-mobile-nav-panel]");
  const getTrigger = () => d.querySelector("[data-mobile-nav-trigger]");
  const getScrollTop = () => Math.max(w.scrollY, d.documentElement.scrollTop, 0);
  const isDesktopViewport = () => w.innerWidth >= desktopMinWidth;
  const isOpen = () => getDrawer()?.getAttribute("data-open") === "true";

  const isFocusable = (element) => {
    if (!(element instanceof HTMLElement)) {
      return false;
    }

    if (element.hasAttribute("disabled") || element.getAttribute("aria-hidden") === "true") {
      return false;
    }

    const styles = w.getComputedStyle(element);
    return styles.display !== "none" && styles.visibility !== "hidden";
  };

  const getTabbableElements = () => {
    const panel = getPanel();
    if (!(panel instanceof HTMLElement)) {
      return [];
    }

    return Array.from(
      panel.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ).filter(isFocusable);
  };

  const focusPanel = () => {
    const panel = getPanel();
    if (panel instanceof HTMLElement) {
      w.requestAnimationFrame(() => panel.focus());
    }
  };

  const triggerCanReceiveFocus = () => {
    const trigger = getTrigger();
    if (!(trigger instanceof HTMLElement)) {
      return false;
    }

    const styles = w.getComputedStyle(trigger);
    return styles.display !== "none" && styles.visibility !== "hidden";
  };

  const applyHeaderState = (scrollY) => {
    const header = getHeader();
    if (!(header instanceof HTMLElement)) {
      return;
    }

    header.dataset.headerState = scrollY > 48 ? "scrolled" : "over-hero";
    header.dataset.headerSize = scrollY > 96 ? "compact" : "full";
  };

  const syncHeader = () => applyHeaderState(getScrollTop());

  const setDrawerOpen = (open, options = {}) => {
    const drawer = getDrawer();
    const panel = getPanel();
    const trigger = getTrigger();
    const restoreFocus = options.restoreFocus ?? true;
    const moveFocus = options.moveFocus ?? true;

    if (!(drawer instanceof HTMLElement) || !(panel instanceof HTMLElement) || !(trigger instanceof HTMLElement)) {
      return;
    }

    const nextOpen = open && !isDesktopViewport();

    drawer.dataset.open = String(nextOpen);
    drawer.hidden = !nextOpen;
    drawer.setAttribute("aria-hidden", String(!nextOpen));
    trigger.dataset.open = String(nextOpen);
    trigger.setAttribute("aria-expanded", String(nextOpen));
    trigger.setAttribute("aria-label", nextOpen ? closeMenuLabel : openMenuLabel);
    d.body.style.overflow = nextOpen ? "hidden" : "";

    if (nextOpen) {
      if (moveFocus) {
        focusPanel();
      }
      return;
    }

    if (restoreFocus && triggerCanReceiveFocus()) {
      w.requestAnimationFrame(() => trigger.focus());
    }
  };

  if (!w.__luxStickyHeaderInit) {
    let animationFrame = 0;

    const handleScroll = () => {
      w.cancelAnimationFrame(animationFrame);
      animationFrame = w.requestAnimationFrame(syncHeader);
    };

    const handleResize = () => {
      handleScroll();
      if (isDesktopViewport() && isOpen()) {
        setDrawerOpen(false, { restoreFocus: false, moveFocus: false });
      }
    };

    d.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      if (target.closest("[data-mobile-nav-trigger]")) {
        event.preventDefault();
        setDrawerOpen(!isOpen(), { restoreFocus: false });
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
      if (!isOpen()) {
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        setDrawerOpen(false);
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const panel = getPanel();
      if (!(panel instanceof HTMLElement)) {
        return;
      }

      const tabbableElements = getTabbableElements();
      if (tabbableElements.length === 0) {
        event.preventDefault();
        panel.focus();
        return;
      }

      const first = tabbableElements[0];
      const last = tabbableElements[tabbableElements.length - 1];
      const active = d.activeElement;

      if (active === panel) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
        return;
      }

      if (!panel.contains(active)) {
        event.preventDefault();
        first.focus();
        return;
      }

      if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      }
    });

    w.addEventListener("scroll", handleScroll, { passive: true });
    w.addEventListener("resize", handleResize);

    w.__luxStickyHeaderInit = true;
  }

  setDrawerOpen(false, { restoreFocus: false, moveFocus: false });
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
                aria-controls="lux-mobile-nav-drawer"
                aria-expanded="false"
                aria-haspopup="dialog"
                aria-label="Open menu"
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
