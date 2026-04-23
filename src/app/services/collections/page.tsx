import Image from "next/image";
import Link from "next/link";

import { EngagementTracker } from "@/components/EngagementTracker";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { TrackedLink } from "@/components/TrackedLink";
import { getSiteContent } from "@/lib/sanity";
import { getServiceCollections } from "@/lib/service-collections";

export const metadata = {
  title: "Service Houses",
  description:
    "Explore House of Rose service houses: facial artistry, skin regeneration, and wellness restoration.",
};

export default async function ServiceCollectionsPage() {
  const content = await getSiteContent();
  const collections = getServiceCollections(content);

  return (
    <>
      <EngagementTracker page="service_collections" />
      <SiteHeader
        brandName={content.brandName}
        primaryCtaHref={content.hero.primaryCtaHref}
        primaryCtaLabel={content.hero.primaryCtaLabel}
      />

      <main className="lux-page">
        <section className="lux-hero">
          <Image
            src="/generated/house-of-rose-hero.png"
            alt="House of Rose luxury service houses"
            fill
            priority
            className="lux-hero-image"
            style={{ objectPosition: "center 28%" }}
          />
          <div className="lux-hero-overlay" />
          <div className="shell lux-hero-content reveal-up">
            <p className="lux-kicker">Service Houses</p>
            <span className="lux-hero-brand">{content.brandName}</span>
            <h1>Explore treatments by aesthetic goal, not just service name.</h1>
            <p>
              We organize care into curated service houses so you can quickly understand
              how options work together to deliver a polished and personalized result.
            </p>
            <TrackedLink
              href={content.hero.primaryCtaHref}
              className="lux-btn lux-btn-primary"
              eventName="book_cta_click"
              eventDetails={{ placement: "collection_hub_hero" }}
            >
              {content.hero.primaryCtaLabel}
            </TrackedLink>
          </div>
        </section>

        <section className="lux-section shell">
          <div className="lux-section-head reveal-up">
            <p className="lux-kicker">Curated Pathways</p>
            <h2>Three luxury pathways built around your goals.</h2>
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
                  <div className="collection-services">
                    {collection.services.map((service) => (
                      <span key={service.slug}>{service.name}</span>
                    ))}
                  </div>
                  <Link href={`/services/collections/${collection.slug}`} className="text-link">
                    View {collection.name.toLowerCase()}
                  </Link>
                </div>
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
