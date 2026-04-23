import Image from "next/image";
import Link from "next/link";

import { EngagementTracker } from "@/components/EngagementTracker";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { TrackedLink } from "@/components/TrackedLink";
import { getPackageHighlights } from "@/lib/medusa";
import { getSiteContent } from "@/lib/sanity";
import { getServiceCollections } from "@/lib/service-collections";

export default async function HomePage() {
  const [content, packageResult] = await Promise.all([
    getSiteContent(),
    getPackageHighlights(),
  ]);

  const featuredServices = content.services.slice(0, 6);
  const collections = getServiceCollections(content);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: content.brandName,
    image: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com"}/generated/house-of-rose-hero.png`,
    telephone: content.contact.phone,
    email: content.contact.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: content.city,
      addressRegion: content.state,
      addressCountry: "US",
      streetAddress: content.contact.addressLine1,
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Aesthetic and Wellness Services",
      itemListElement: content.services.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.name,
          description: service.description,
          areaServed: `${content.city}, ${content.state}`,
        },
      })),
    },
  };

  return (
    <>
      <EngagementTracker page="home" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader
        brandName={content.brandName}
        primaryCtaHref={content.hero.primaryCtaHref}
        primaryCtaLabel={content.hero.primaryCtaLabel}
      />

      <main className="lux-page">
        <section className="lux-hero">
          <Image
            src="/generated/house-of-rose-hero.png"
            alt="House of Rose luxury treatment suite"
            fill
            priority
            className="lux-hero-image"
            style={{ objectPosition: "center 30%" }}
          />
          <div className="lux-hero-overlay" />
          <div className="shell lux-hero-content reveal-up">
            <p className="lux-kicker">{content.hero.eyebrow}</p>
            <span className="lux-hero-brand">{content.brandName}</span>
            <h1>{content.hero.title}</h1>
            <p>{content.hero.description}</p>
            <p className="lux-muted-copy">{content.hero.secondaryDescription}</p>
            <div className="lux-hero-actions">
              <TrackedLink
                href={content.hero.primaryCtaHref}
                className="lux-btn lux-btn-primary"
                eventName="book_cta_click"
                eventDetails={{ placement: "home_hero" }}
              >
                {content.hero.primaryCtaLabel}
              </TrackedLink>
              <TrackedLink
                href={content.hero.secondaryCtaHref}
                className="lux-btn lux-btn-tertiary"
                eventName="contact_intent"
                eventDetails={{ placement: "home_hero_services" }}
              >
                {content.hero.secondaryCtaLabel}
              </TrackedLink>
            </div>
          </div>
        </section>

        <section className="lux-section shell">
          <div className="lux-section-head reveal-up">
            <p className="lux-kicker">Service Houses</p>
            <h2>Luxury pathways that make service selection effortless.</h2>
            <p>
              Use these curated pathways to understand which treatments pair together and
              what outcome each category is designed to deliver.
            </p>
          </div>
          <div className="collection-grid">
            {collections.map((collection) => (
              <article key={collection.slug} className="collection-card reveal-up">
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
                    Explore {collection.name.toLowerCase()}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="lux-section shell">
          <div className="lux-section-head reveal-up">
            <p className="lux-kicker">Signature Services</p>
            <h2>Detailed service pages designed for confident decision-making.</h2>
          </div>
          <div className="service-preview-grid">
            {featuredServices.map((service) => (
              <article key={service.slug} className="service-preview-card reveal-up">
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
                <Link href={`/services/${service.slug}`} className="text-link">
                  View service page
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="lux-section shell lux-editorial-grid">
          <div className="lux-editorial-image reveal-up">
            <Image
              src="/generated/reception-arrival-editorial.png"
              alt="House of Rose guest arrival"
              fill
              className="fit-image"
              style={{ objectPosition: "left center" }}
            />
          </div>
          <div className="lux-editorial-copy reveal-up">
            <p className="lux-kicker">Why House of Rose</p>
            <h2>{content.about.heading}</h2>
            <p>{content.about.description}</p>
            <div className="lux-list">
              {content.about.credentials.map((credential) => (
                <p key={credential}>{credential}</p>
              ))}
            </div>
            <Link href="/experience" className="text-link">
              Explore the guest experience
            </Link>
          </div>
        </section>

        <section className="lux-section shell">
          <div className="lux-section-head reveal-up">
            <p className="lux-kicker">Consultation + Pricing</p>
            <h2>Commerce signals sourced from Medusa.</h2>
            <p>
              Package visibility is surfaced from the commerce layer. Final treatment design
              and pricing are confirmed during consultation.
            </p>
            {!packageResult.fromMedusa ? (
              <p className="subtle-note">
                Live package pricing is temporarily unavailable. Consultation pricing is
                still active.
              </p>
            ) : null}
          </div>
          <div className="pricing-grid">
            {packageResult.packages.map((pkg) => (
              <article key={pkg.id} className="pricing-card reveal-up">
                <p className="service-name">{pkg.title}</p>
                <p>{pkg.subtitle}</p>
                <p className="pricing-value">{pkg.priceLabel}</p>
                <p>{pkg.availabilityLabel}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="lux-section shell">
          <div className="lux-section-head reveal-up">
            <p className="lux-kicker">Guest Perspective</p>
            <h2>Care that feels as elevated as the result.</h2>
          </div>
          <div className="testimonial-grid">
            {content.testimonials.map((testimonial) => (
              <article key={testimonial.id} className="testimonial-card reveal-up">
                <p className="testimonial-quote">“{testimonial.quote}”</p>
                <p className="testimonial-author">{testimonial.author}</p>
                <p>{testimonial.treatment}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="lux-section shell" id="contact">
          <div className="lux-final-cta reveal-up">
            <p className="lux-kicker">Book Your Consultation</p>
            <h2>Begin with a private conversation in {content.city}, {content.state}.</h2>
            <p>
              {content.contact.hours}
              <br />
              {content.contact.addressLine1}
              <br />
              {content.contact.addressLine2}
            </p>
            <div className="lux-hero-actions">
              <TrackedLink
                href={content.hero.primaryCtaHref}
                className="lux-btn lux-btn-primary"
                eventName="book_cta_click"
                eventDetails={{ placement: "home_contact" }}
              >
                {content.hero.primaryCtaLabel}
              </TrackedLink>
              <TrackedLink
                href={`tel:${content.contact.phone.replace(/[^\d+]/g, "")}`}
                className="lux-btn lux-btn-tertiary"
                eventName="contact_intent"
                eventDetails={{ placement: "home_phone" }}
              >
                {content.contact.phone}
              </TrackedLink>
            </div>
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
