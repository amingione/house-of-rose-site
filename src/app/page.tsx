import Image from "next/image";
import Link from "next/link";

import { EngagementTracker } from "@/components/EngagementTracker";
import { TrackedLink } from "@/components/TrackedLink";
import { getPackageHighlights } from "@/lib/medusa";
import { getSiteContent } from "@/lib/sanity";

export default async function HomePage() {
  const [content, packageResult] = await Promise.all([
    getSiteContent(),
    getPackageHighlights(),
  ]);

  const featuredServices = content.services.slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: content.brandName,
    image: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com"}/inspo/reception-white.png`,
    telephone: content.contact.phone,
    email: content.contact.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: content.city,
      addressRegion: content.state,
      addressCountry: "US",
      streetAddress: content.contact.addressLine1,
    },
    areaServed: [
      {
        "@type": "City",
        name: content.city,
      },
      {
        "@type": "AdministrativeArea",
        name: "Charlotte County",
      },
    ],
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

      <header className="site-header">
        <Link href="/" className="brand-mark">
          {content.brandName}
        </Link>
        <nav aria-label="Primary">
          <ul className="header-nav">
            <li>
              <a href="#services">Services</a>
            </li>
            <li>
              <a href="#experience">Experience</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
          </ul>
        </nav>
        <TrackedLink
          href={content.hero.primaryCtaHref}
          className="header-cta"
          eventName="book_cta_click"
          eventDetails={{ placement: "header" }}
        >
          {content.hero.primaryCtaLabel}
        </TrackedLink>
      </header>

      <main>
        <section className="hero-section editorial-hero" id="top">
          <Image
            src="/inspo/reception-white.png"
            alt="Softly lit treatment suite at House of Rose"
            fill
            priority
            className="hero-bg hero-bg-crop"
          />
          <div className="hero-overlay hero-overlay-editorial" />
          <div className="hero-content hero-content-editorial reveal-up">
            <p className="eyebrow">{content.hero.eyebrow}</p>
            <span className="hero-brand">{content.brandName}</span>
            <h1>{content.hero.title}</h1>
            <p className="hero-copy">{content.hero.description}</p>
            <p className="hero-copy hero-copy-muted">{content.hero.secondaryDescription}</p>
            <div className="hero-actions">
              <TrackedLink
                href={content.hero.primaryCtaHref}
                className="btn-primary"
                eventName="book_cta_click"
                eventDetails={{ placement: "hero" }}
              >
                {content.hero.primaryCtaLabel}
              </TrackedLink>
              <TrackedLink
                href={content.hero.secondaryCtaHref}
                className="btn-secondary"
                eventName="contact_intent"
                eventDetails={{ placement: "hero" }}
              >
                {content.hero.secondaryCtaLabel}
              </TrackedLink>
            </div>
          </div>
          <div className="hero-notes reveal-up">
            <p>Consultation led</p>
            <p>Natural-looking outcomes</p>
            <p>Private Punta Gorda studio</p>
          </div>
        </section>

        <section className="section shell distinction-section">
          <div className="section-head reveal-up">
            <p className="kicker">Why House of Rose</p>
            <h2>{content.about.heading}</h2>
            <p>{content.about.description}</p>
          </div>
          <div className="distinction-grid">
            {content.about.credentials.map((item) => (
              <article className="distinction-item reveal-up" key={item}>
                <p>{item}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section shell signature-section" id="services">
          <div className="section-head reveal-up">
            <p className="kicker">Signature Services</p>
            <h2>Treatments shaped around outcomes that read refined, never obvious.</h2>
            <p>
              Each recommendation is personalized to your features, your comfort level,
              and how you want to move through the world after treatment.
            </p>
          </div>
          <div className="signature-grid">
            {featuredServices.map((service) => (
              <article className="signature-item reveal-up" key={service.id}>
                <div className="signature-image-wrap">
                  <Image
                    src={service.heroImage}
                    alt={service.heroAlt}
                    fill
                    className="fit-image"
                    style={{ objectPosition: service.heroImagePosition }}
                  />
                </div>
                <div className="signature-copy">
                  <p className="service-name">{service.name}</p>
                  <h3>{service.highlight}</h3>
                  <p>{service.promise}</p>
                  <Link href={`/services/${service.slug}`} className="service-link">
                    Discover {service.name.toLowerCase()}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section editorial-band" id="experience">
          <div className="shell editorial-band-grid">
            <div className="editorial-image-stack reveal-up">
              <div className="editorial-primary-image">
                <Image
                  src="/inspo/refreshment-corner.png"
                  alt="House of Rose hospitality details"
                  fill
                  className="fit-image"
                />
              </div>
              <div className="editorial-secondary-image">
                <Image
                  src="/inspo/reception-marble.png"
                  alt="House of Rose studio arrival atmosphere"
                  fill
                  className="fit-image"
                  style={{ objectPosition: "left center" }}
                />
              </div>
            </div>
            <div className="editorial-copy reveal-up">
              <p className="kicker">The Experience</p>
              <h2>Private, polished, and intentionally unhurried.</h2>
              <p>
                House of Rose is built for clients who want clinical credibility without
                the transactional feel. Consultations are thoughtful, treatment plans are
                tailored, and the environment is designed to feel calm from the moment you
                arrive.
              </p>
              <div className="editorial-list">
                <p>Discreet, high-touch appointment flow</p>
                <p>Tailored treatment planning rather than one-size-fits-all protocols</p>
                <p>Results that feel elegant in person, on camera, and over time</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section shell" id="packages">
          <div className="section-head reveal-up section-head-narrow">
            <p className="kicker">Consultation + Pricing</p>
            <h2>Packages and pricing signals remain grounded in Medusa.</h2>
            <p>
              Final recommendations are confirmed after consultation. When available, live
              package signals are surfaced directly from the commerce layer.
            </p>
            {!packageResult.fromMedusa ? (
              <p className="subtle-note">
                Live package pricing is temporarily unavailable. Consultation pricing is
                still active.
              </p>
            ) : null}
          </div>
          <div className="package-row package-row-editorial">
            {packageResult.packages.map((pkg) => (
              <article className="package-item reveal-up" key={pkg.id}>
                <p className="package-title">{pkg.title}</p>
                <p>{pkg.subtitle}</p>
                <p className="package-price">{pkg.priceLabel}</p>
                <p className="package-availability">{pkg.availabilityLabel}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section shell testimonials testimonials-editorial">
          <div className="section-head reveal-up section-head-narrow">
            <p className="kicker">Guest Perspective</p>
            <h2>The appeal is not only how you look. It is how carefully the experience is handled.</h2>
          </div>
          <div className="testimonial-strip testimonial-strip-editorial">
            {content.testimonials.map((testimonial) => (
              <article className="testimonial reveal-up" key={testimonial.id}>
                <p className="testimonial-quote">“{testimonial.quote}”</p>
                <p className="testimonial-author">{testimonial.author}</p>
                <p className="testimonial-treatment">{testimonial.treatment}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section shell faq-grid faq-grid-editorial">
          <div className="section-head reveal-up">
            <p className="kicker">Before You Book</p>
            <h2>Clear expectations, tailored recommendations, and no rushed decision-making.</h2>
          </div>
          <div>
            {content.faqs.map((faq) => (
              <details className="faq-item reveal-up" key={faq.id}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="section shell contact-panel contact-panel-editorial" id="contact">
          <div className="contact-copy reveal-up">
            <p className="kicker">Book Your Consultation</p>
            <h2>Begin with a private conversation in {content.city}, {content.state}.</h2>
            <p>
              {content.contact.hours}
              <br />
              {content.contact.addressLine1}
              <br />
              {content.contact.addressLine2}
            </p>
          </div>
          <div className="contact-actions reveal-up">
            <TrackedLink
              href={content.hero.primaryCtaHref}
              className="btn-primary"
              eventName="book_cta_click"
              eventDetails={{ placement: "contact" }}
            >
              {content.hero.primaryCtaLabel}
            </TrackedLink>
            <TrackedLink
              href={`tel:${content.contact.phone.replace(/[^\d+]/g, "")}`}
              className="btn-secondary"
              eventName="contact_intent"
              eventDetails={{ placement: "contact_phone" }}
            >
              {content.contact.phone}
            </TrackedLink>
            <TrackedLink
              href={`mailto:${content.contact.email}`}
              className="text-link"
              eventName="contact_intent"
              eventDetails={{ placement: "contact_email" }}
            >
              {content.contact.email}
            </TrackedLink>
          </div>
        </section>
      </main>
    </>
  );
}
