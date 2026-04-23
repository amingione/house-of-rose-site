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

      <main className="lux-page">
        <section className="lux-hero">
          <Image
            src="/generated/house-of-rose-hero.png"
            alt="House of Rose services overview"
            fill
            priority
            className="lux-hero-image"
            style={{ objectPosition: "left center" }}
          />
          <div className="lux-hero-overlay" />
          <div className="shell lux-hero-content reveal-up">
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

        <section className="lux-section shell">
          <div className="lux-section-head reveal-up">
            <p className="lux-kicker">Start Here</p>
            <h2>Browse by outcome category.</h2>
          </div>
          <div className="collection-grid">
            {collections.map((collection) => (
              <article className="collection-card reveal-up" key={collection.slug}>
                <div className="collection-image-wrap">
                  <Image
                    src={collection.heroImage}
                    alt={collection.heroAlt}
                    fill
                    className="fit-image"
                    style={{ objectPosition: collection.heroImagePosition }}
                  />
                </div>
                <div className="collection-copy">
                  <p className="lux-kicker">{collection.name}</p>
                  <h3>{collection.headline}</h3>
                  <p>{collection.description}</p>
                  <Link href={`/services/collections/${collection.slug}`} className="text-link">
                    Enter {collection.name.toLowerCase()}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="lux-section shell">
          <div className="lux-section-head reveal-up">
            <p className="lux-kicker">All Services</p>
            <h2>Detailed pages for every treatment.</h2>
          </div>
          <div className="service-preview-grid">
            {content.services.map((service) => (
              <article className="service-preview-card reveal-up" key={service.id}>
                <div className="service-preview-image">
                  <Image
                    src={service.heroImage}
                    alt={service.heroAlt}
                    fill
                    className="fit-image"
                    style={{ objectPosition: service.heroImagePosition }}
                  />
                </div>
                <p className="service-name">{service.name}</p>
                <h3>{service.highlight}</h3>
                <p>{service.promise}</p>
                <p className="service-meta">{service.duration} · {service.downtime}</p>
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
