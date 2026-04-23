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

  const collections = getServiceCollections(content);
  const featuredServices = content.services.slice(0, 5);
  const spotlightCollection = collections[0];
  const leadService = featuredServices[0];
  const supportingServices = featuredServices.slice(1);
  const leadTestimonial = content.testimonials[0];
  const supportingTestimonials = content.testimonials.slice(1, 3);
  const featuredPackages = packageResult.packages.slice(0, 3);

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
        <section data-section="home-hero" className="lux-hero lux-bleed">
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
            <div className="home-hero-grid">
              <div className="home-hero-copy">
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

              <div className="home-hero-aside">
                {content.about.credentials.map((credential, index) => (
                  <p key={`hero-credential-${index}-${credential}`}>{credential}</p>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section data-section="home-split" className="lux-split lux-bleed">
          <div className="shell home-split-shell">
            <div className="home-split-copy reveal-up">
              <p className="lux-kicker">Service Houses</p>
              <h2>Luxury pathways that make service selection effortless.</h2>
              <p>
                Use these curated pathways to understand which treatments pair together
                and what outcome each category is designed to deliver.
              </p>

              <div className="home-collection-list">
                {collections.map((collection) => (
                  <article key={collection.slug} className="home-collection-item">
                    <div>
                      <p className="lux-kicker">{collection.name}</p>
                      <h3>{collection.headline}</h3>
                      <p>{collection.description}</p>
                    </div>
                    <Link
                      href={`/services/collections/${collection.slug}`}
                      className="text-link"
                    >
                      Explore {collection.name.toLowerCase()}
                    </Link>
                  </article>
                ))}
              </div>
            </div>

            <div className="home-split-media reveal-up">
              <Image
                src={spotlightCollection?.heroImage ?? "/generated/skin-renewal-editorial.png"}
                alt={
                  spotlightCollection?.heroAlt ??
                  "Editorial treatment suite at House of Rose"
                }
                fill
                className="fit-image"
                style={{ objectPosition: spotlightCollection?.heroImagePosition ?? "center center" }}
              />
              <div className="home-split-panel">
                <p className="lux-kicker">Featured Path</p>
                <h3>{spotlightCollection?.name ?? "Consultation-Led Treatment Planning"}</h3>
                <p>
                  {spotlightCollection?.ctaLine ??
                    "Begin with a private consultation and leave with a tailored roadmap that respects your features, timing, and goals."}
                </p>
                <div className="home-split-tags">
                  {(spotlightCollection?.services ?? []).map((service) => (
                    <span key={service.slug}>{service.name}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section data-section="home-full-image" className="lux-full-image lux-bleed">
          <Image
            src="/generated/reception-arrival-editorial.png"
            alt="House of Rose guest arrival"
            fill
            className="fit-image"
            style={{ objectPosition: "center center" }}
          />
          <div className="lux-full-image-overlay" />
          <div className="shell home-full-image-shell reveal-up">
            <div className="home-full-image-copy">
              <p className="lux-kicker">Why House of Rose</p>
              <h2>{content.about.heading}</h2>
              <p>{content.about.description}</p>
            </div>
            <div className="home-credential-grid">
              {content.about.credentials.map((credential, index) => (
                <p key={`full-image-credential-${index}-${credential}`}>{credential}</p>
              ))}
            </div>
          </div>
        </section>

        <section data-section="home-service-preview" className="lux-section shell home-services">
          <div className="lux-section-head reveal-up">
            <p className="lux-kicker">Signature Services</p>
            <h2>Detailed service pages designed for confident decision-making.</h2>
            <p>
              Each service page preserves the consultative tone of the studio while
              keeping commerce signals sourced from Medusa where they belong.
            </p>
          </div>

          <div className="home-services-layout">
            {leadService ? (
              <article className="home-service-feature reveal-up">
                <div className="home-service-feature-image">
                  <Image
                    src={leadService.heroImage}
                    alt={leadService.heroAlt}
                    fill
                    className="fit-image"
                    style={{ objectPosition: leadService.heroImagePosition }}
                  />
                </div>
                <div className="home-service-feature-copy">
                  <p className="lux-kicker">{leadService.name}</p>
                  <h3>{leadService.highlight}</h3>
                  <p>{leadService.promise}</p>
                  <p className="service-meta">
                    {leadService.duration} · {leadService.downtime}
                  </p>
                  <Link href={`/services/${leadService.slug}`} className="text-link">
                    View service page
                  </Link>
                </div>
              </article>
            ) : null}

            <div className="home-service-rail">
              {supportingServices.map((service) => (
                <article key={service.slug} className="home-service-item reveal-up">
                  <p className="service-name">{service.name}</p>
                  <h3>{service.highlight}</h3>
                  <p>{service.promise}</p>
                  <p className="service-meta">
                    {service.duration} · {service.downtime}
                  </p>
                  <Link href={`/services/${service.slug}`} className="text-link">
                    View service page
                  </Link>
                </article>
              ))}
            </div>
          </div>

          <div className="home-package-band reveal-up">
            <div className="home-package-copy">
              <p className="lux-kicker">Consultation + Pricing</p>
              <h3>Commerce signals sourced from Medusa.</h3>
              <p>
                Package visibility is surfaced from the commerce layer. Final treatment
                design and pricing are confirmed during consultation.
              </p>
              {!packageResult.fromMedusa ? (
                <p className="subtle-note">
                  Live package pricing is temporarily unavailable. Consultation pricing
                  is still active.
                </p>
              ) : null}
            </div>

            <div className="home-package-list">
              {featuredPackages.map((pkg) => (
                <article key={pkg.id} className="home-package-item">
                  <p className="service-name">{pkg.title}</p>
                  <p>{pkg.subtitle}</p>
                  <p className="pricing-value">{pkg.priceLabel}</p>
                  <p>{pkg.availabilityLabel}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          data-section="home-experience-teaser"
          className="lux-section shell home-experience"
        >
          <div className="home-experience-intro reveal-up">
            <p className="lux-kicker">Guest Perspective</p>
            <h2>Care that feels as elevated as the result.</h2>
            <p>
              Every touchpoint is designed to feel discreet, considered, and deeply
              personal from consultation through follow-through.
            </p>
            <Link href="/experience" className="text-link">
              Explore the guest experience
            </Link>
          </div>

          <div className="home-experience-layout">
            {leadTestimonial ? (
              <article className="home-quote-card reveal-up">
                <p className="testimonial-quote">“{leadTestimonial.quote}”</p>
                <p className="testimonial-author">{leadTestimonial.author}</p>
                <p>{leadTestimonial.treatment}</p>
              </article>
            ) : null}

            <div className="home-testimonial-grid">
              {supportingTestimonials.map((testimonial) => (
                <article key={testimonial.id} className="testimonial-card reveal-up">
                  <p className="testimonial-quote">“{testimonial.quote}”</p>
                  <p className="testimonial-author">{testimonial.author}</p>
                  <p>{testimonial.treatment}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section data-section="home-contact" className="lux-section shell" id="contact">
          <div className="lux-final-cta reveal-up home-contact-panel">
            <div className="home-contact-copy">
              <p className="lux-kicker">Book Your Consultation</p>
              <h2>
                Begin with a private conversation in {content.city}, {content.state}.
              </h2>
              <p>
                {content.contact.hours}
                <br />
                {content.contact.addressLine1}
                <br />
                {content.contact.addressLine2}
              </p>
            </div>

            <div className="home-contact-actions">
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
              <TrackedLink
                href={`mailto:${content.contact.email}`}
                className="text-link"
                eventName="contact_intent"
                eventDetails={{ placement: "home_email" }}
              >
                {content.contact.email}
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
