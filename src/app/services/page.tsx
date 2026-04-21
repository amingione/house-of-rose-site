import Image from "next/image";

import { EngagementTracker } from "@/components/EngagementTracker";
import { TrackedLink } from "@/components/TrackedLink";
import { getSiteContent } from "@/lib/sanity";

export const metadata = {
  title: "Services",
  description:
    "Explore House of Rose services in Punta Gorda, including injectables, skin renewal, permanent makeup, PRP rejuvenation, wellness support, and hydration therapy.",
};

export default async function ServicesPage() {
  const content = await getSiteContent();

  return (
    <>
      <EngagementTracker page="services_index" />
      <main className="service-hub">
        <section className="service-hub-hero">
          <Image
            src="/inspo/treatment-gold.png"
            alt="House of Rose service atmosphere"
            fill
            priority
            className="hero-bg"
            style={{ objectPosition: "left center" }}
          />
          <div className="hero-overlay hero-overlay-editorial" />
          <div className="service-hub-hero-copy reveal-up shell">
            <p className="eyebrow">House of Rose Services</p>
            <h1>Signature treatments designed to feel tailored from the very first consultation.</h1>
            <p>
              Explore injectable artistry, skin renewal, regenerative care, effortless
              beauty services, and wellness support delivered in a setting that feels calm,
              elevated, and deeply personal.
            </p>
            <TrackedLink
              href={content.hero.primaryCtaHref}
              className="btn-primary"
              eventName="book_cta_click"
              eventDetails={{ placement: "services_index" }}
            >
              {content.hero.primaryCtaLabel}
            </TrackedLink>
          </div>
        </section>

        <section className="section shell service-hub-intro">
          <div className="section-head reveal-up section-head-narrow">
            <p className="kicker">Tailored Care</p>
            <h2>No rushed protocols. No generic beauty language. Just treatment planning with taste.</h2>
            <p>
              Every service begins with goals, anatomy, timing, and comfort in mind. The
              standard is always the same: refined outcomes and an experience that feels
              worthy of the investment.
            </p>
          </div>

          <div className="service-hub-grid service-hub-grid-editorial">
            {content.services.map((service) => (
              <article className="service-hub-card service-hub-card-editorial reveal-up" key={service.id}>
                <div className="service-hub-image-wrap service-hub-image-wrap-tall">
                  <Image
                    src={service.heroImage}
                    alt={service.heroAlt}
                    fill
                    className="fit-image"
                    style={{ objectPosition: service.heroImagePosition }}
                  />
                </div>
                <div>
                  <p className="service-name">{service.name}</p>
                  <h2>{service.highlight}</h2>
                  <p>{service.promise}</p>
                  <div className="service-meta-line">
                    <span>{service.duration}</span>
                    <span>{service.downtime}</span>
                  </div>
                  <TrackedLink
                    href={`/services/${service.slug}`}
                    className="service-link"
                    eventName="service_view"
                    eventDetails={{ service: service.slug, placement: "services_index" }}
                  >
                    View service details
                  </TrackedLink>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
