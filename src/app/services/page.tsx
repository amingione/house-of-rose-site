import Image from "next/image";
import Link from "next/link";

import { EngagementTracker } from "@/components/EngagementTracker";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { TrackedLink } from "@/components/TrackedLink";
import { getSiteContent } from "@/lib/sanity";
import { getServiceCollections } from "@/lib/service-collections";

export const metadata = {
  title: "Services",
  description:
    "Explore the full House of Rose services menu with category pathways and dedicated treatment pages.",
};

export default async function ServicesPage() {
  const content = await getSiteContent();
  const collections = getServiceCollections(content);

  return (
    <>
      <EngagementTracker page="services_index" />
      <SiteHeader
        brandName={content.brandName}
        primaryCtaHref={content.hero.primaryCtaHref}
        primaryCtaLabel={content.hero.primaryCtaLabel}
      />

      <main className="lux-page service-hub">
        <section data-section="services-hero" className="lux-hero lux-bleed">
          <Image
            src="/generated/house-of-rose-hero.png"
            alt="House of Rose services overview"
            fill
            priority
            className="lux-hero-image"
            style={{ objectPosition: "left center" }}
          />
          <div className="lux-hero-overlay" />
          <div className="service-hub-hero-copy reveal-up">
            <p className="lux-kicker">Services</p>
            <span className="lux-hero-brand">{content.brandName}</span>
            <h1>Treatment pages built to help you choose with confidence.</h1>
            <p>
              Explore service houses for high-level guidance, then move into detailed
              treatment pages for candidacy, approach, and expected outcomes.
            </p>
            <div className="lux-hero-actions">
              <TrackedLink
                href={content.hero.primaryCtaHref}
                className="lux-btn lux-btn-primary"
                eventName="book_cta_click"
                eventDetails={{ placement: "services_hero" }}
              >
                {content.hero.primaryCtaLabel}
              </TrackedLink>
              <Link href="/services/collections" className="lux-btn lux-btn-tertiary">
                View service houses
              </Link>
            </div>
          </div>
        </section>

        <section
          data-section="services-index"
          className="lux-section shell service-hub-index"
        >
          <div className="lux-section-head reveal-up">
            <p className="lux-kicker">Start Here</p>
            <h2>Browse by service house or go directly to a treatment page.</h2>
            <p>
              Begin with an editorial pathway if you are still narrowing the outcome, or
              move straight to the service detail that matches what you already know you
              want to discuss.
            </p>
          </div>
          <div className="service-hub-grid-editorial">
            {collections.map((collection) => (
              <article
                className="service-hub-card service-hub-card-editorial reveal-up"
                key={collection.slug}
              >
                <div className="service-hub-image-wrap service-hub-image-wrap-tall">
                  <Image
                    src={collection.heroImage}
                    alt={collection.heroAlt}
                    fill
                    className="fit-image"
                    style={{ objectPosition: collection.heroImagePosition }}
                  />
                </div>
                <div>
                  <p className="service-name">{collection.name}</p>
                  <h3>{collection.headline}</h3>
                  <p>{collection.description}</p>
                  <p className="service-meta-line">
                    <span>
                      {collection.services.length}{" "}
                      {collection.services.length === 1 ? "service" : "services"}
                    </span>
                    <span>Guided pathway</span>
                  </p>
                  <Link href={`/services/collections/${collection.slug}`} className="text-link">
                    Enter {collection.name.toLowerCase()}
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="lux-section-head reveal-up service-hub-subhead">
            <p className="lux-kicker">All Services</p>
            <h2>Detailed pages for every treatment.</h2>
            <p>
              Each service page covers candidacy, process, recovery expectations, and
              related options so the consultation starts from a clearer place.
            </p>
          </div>
          <div className="service-detail-grid service-hub-service-grid">
            {content.services.map((service) => (
              <article className="service-detail-card reveal-up" key={service.id}>
                <p className="service-name">{service.name}</p>
                <h3>{service.highlight}</h3>
                <p>{service.promise}</p>
                <p className="service-meta-line">
                  <span>{service.duration}</span>
                  <span>{service.downtime}</span>
                </p>
                <TrackedLink
                  href={`/services/${service.slug}`}
                  className="text-link"
                  eventName="service_view"
                  eventDetails={{ service: service.slug, placement: "services_index" }}
                >
                  View service details
                </TrackedLink>
              </article>
            ))}
          </div>
        </section>

        <section
          data-section="services-how-to-choose"
          className="lux-section lux-bleed editorial-band"
        >
          <div className="shell editorial-band-grid service-guidance-layout">
            <div className="editorial-copy service-guidance-copy reveal-up">
              <p className="lux-kicker">How To Choose</p>
              <h2>Use outcome, downtime, and maintenance to narrow the right conversation.</h2>
              <p>
                The best starting point is rarely a single trend treatment. Focus on the
                look you want, the recovery window you can tolerate, and how much upkeep
                feels realistic for your routine.
              </p>
            </div>
            <div className="service-guidance-grid">
              <article className="distinction-item reveal-up">
                <p className="lux-kicker">Outcome</p>
                <h3>Start with what you want to change.</h3>
                <p>
                  Browse service houses for broader goals like facial balance, skin
                  regeneration, or wellness support before you compare individual
                  treatments.
                </p>
              </article>
              <article className="distinction-item reveal-up">
                <p className="lux-kicker">Downtime</p>
                <h3>Match the plan to your calendar.</h3>
                <p>
                  Service detail pages outline appointment length and expected recovery so
                  you can rule in options that fit your real schedule.
                </p>
              </article>
              <article className="distinction-item reveal-up">
                <p className="lux-kicker">Maintenance</p>
                <h3>Choose a cadence you can actually keep.</h3>
                <p>
                  Consultation is where treatment layering, upkeep, and long-term pacing
                  are refined into a plan that feels sustainable.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section data-section="services-cta" className="lux-section shell">
          <div className="lux-final-cta reveal-up">
            <p className="lux-kicker">Begin With Consultation</p>
            <h2>Build a treatment plan with luxury guidance, not guesswork.</h2>
            <p>
              Meet with {content.brandName} in {content.city}, {content.state} for a
              private consultation shaped around your features, comfort level, and goals.
            </p>
            <TrackedLink
              href={content.hero.primaryCtaHref}
              className="lux-btn lux-btn-primary"
              eventName="book_cta_click"
              eventDetails={{ placement: "services_footer" }}
            >
              {content.hero.primaryCtaLabel}
            </TrackedLink>
          </div>
        </section>
      </main>

      <SiteFooter
        brandName={content.brandName}
        phone={content.contact.phone}
        email={content.contact.email}
        primaryCtaHref={content.hero.primaryCtaHref}
        primaryCtaLabel={content.hero.primaryCtaLabel}
      />
    </>
  );
}
