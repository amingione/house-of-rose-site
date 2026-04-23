import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { EngagementTracker } from "@/components/EngagementTracker";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { TrackedLink } from "@/components/TrackedLink";
import { getServiceBySlug, getSiteContent } from "@/lib/sanity";
import { getCollectionsForService } from "@/lib/service-collections";

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const content = await getSiteContent();

  return content.services.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const content = await getSiteContent();
  const service = getServiceBySlug(content, slug);

  if (!service) {
    return {
      title: "Service Not Found",
    };
  }

  return {
    title: `${service.name} in ${content.city}, ${content.state}`,
    description: service.promise,
    openGraph: {
      title: `${service.name} | ${content.brandName}`,
      description: service.promise,
      images: [
        {
          url: service.heroImage,
          alt: service.heroAlt,
        },
      ],
    },
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const content = await getSiteContent();
  const service = getServiceBySlug(content, slug);

  if (!service) {
    notFound();
  }

  const relatedCollections = getCollectionsForService(content, service.slug);
  const relatedServices = content.services
    .filter((item) => item.slug !== service.slug)
    .slice(0, 3);

  return (
    <>
      <EngagementTracker page={`service_${service.slug}`} />
      <SiteHeader
        brandName={content.brandName}
        primaryCtaHref={content.hero.primaryCtaHref}
        primaryCtaLabel={content.hero.primaryCtaLabel}
      />

      <main className="lux-page">
        <section className="lux-hero">
          <Image
            src={service.heroImage}
            alt={service.heroAlt}
            fill
            priority
            className="lux-hero-image"
            style={{ objectPosition: service.heroImagePosition }}
          />
          <div className="lux-hero-overlay" />
          <div className="shell lux-hero-content reveal-up">
            <p className="lux-kicker">Signature Service</p>
            <span className="lux-hero-brand">{service.name}</span>
            <h1>{service.highlight}</h1>
            <p>{service.promise}</p>
            <div className="service-fact-grid">
              <p>
                <span>Typical session</span>
                {service.duration}
              </p>
              <p>
                <span>Downtime</span>
                {service.downtime}
              </p>
            </div>
            <div className="lux-hero-actions">
              <TrackedLink
                href={content.hero.primaryCtaHref}
                className="lux-btn lux-btn-primary"
                eventName="book_cta_click"
                eventDetails={{ placement: `service_${service.slug}_hero` }}
              >
                {content.hero.primaryCtaLabel}
              </TrackedLink>
              <Link href="/services" className="lux-btn lux-btn-tertiary">
                Back to services
              </Link>
            </div>
          </div>
        </section>

        <section className="lux-section shell detail-grid">
          <article className="detail-card reveal-up">
            <p className="lux-kicker">Why Clients Choose It</p>
            <h2>{service.name}</h2>
            <p>{service.details}</p>
          </article>
          <article className="detail-card reveal-up">
            <p className="lux-kicker">What It Addresses</p>
            <ul>
              {service.results.map((result) => (
                <li key={result}>{result}</li>
              ))}
            </ul>
          </article>
          <article className="detail-card reveal-up">
            <p className="lux-kicker">Ideal For</p>
            <ul>
              {service.idealFor.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </section>

        <section className="lux-section shell lux-editorial-grid">
          <div className="lux-editorial-image reveal-up">
            <Image
              src={service.heroImage}
              alt={service.heroAlt}
              fill
              className="fit-image"
              style={{ objectPosition: service.heroImagePosition }}
            />
          </div>
          <div className="lux-editorial-copy reveal-up">
            <p className="lux-kicker">The House of Rose Approach</p>
            <h2>Designed around your features, not a template.</h2>
            <div className="lux-list">
              {service.approach.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
            <p className="subtle-note">{service.consultationNote}</p>
          </div>
        </section>

        <section className="lux-section shell detail-grid">
          <article className="detail-card reveal-up">
            <p className="lux-kicker">Benefits</p>
            <ul>
              {service.benefits.map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>
          </article>
          <article className="detail-card reveal-up">
            <p className="lux-kicker">Service Houses</p>
            {relatedCollections.length > 0 ? (
              <ul>
                {relatedCollections.map((collection) => (
                  <li key={collection.slug}>
                    <Link href={`/services/collections/${collection.slug}`} className="text-link">
                      {collection.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>This service is available as a standalone treatment plan.</p>
            )}
          </article>
          <article className="detail-card reveal-up">
            <p className="lux-kicker">What To Expect</p>
            <p className="service-meta">Appointment: {service.duration}</p>
            <p className="service-meta">Downtime: {service.downtime}</p>
            <p>
              Your consultation covers candidacy, anticipated recovery, and whether this
              service should be layered with complementary options.
            </p>
          </article>
        </section>

        <section className="lux-section shell">
          <div className="lux-section-head reveal-up">
            <p className="lux-kicker">Related Services</p>
            <h2>Additional pages to explore.</h2>
          </div>
          <div className="related-grid">
            {relatedServices.map((related) => (
              <article key={related.slug} className="related-card reveal-up">
                <p className="service-name">{related.name}</p>
                <p>{related.promise}</p>
                <TrackedLink
                  href={`/services/${related.slug}`}
                  className="text-link"
                  eventName="service_view"
                  eventDetails={{ placement: `service_${service.slug}_related` }}
                >
                  View details
                </TrackedLink>
              </article>
            ))}
          </div>
        </section>

        <section className="lux-section shell">
          <div className="lux-final-cta reveal-up">
            <p className="lux-kicker">Begin With Consultation</p>
            <h2>Discuss {service.name.toLowerCase()} in a private luxury setting.</h2>
            <p>
              Schedule a consultation at {content.brandName} in {content.city}, {content.state}.
            </p>
            <TrackedLink
              href={content.hero.primaryCtaHref}
              className="lux-btn lux-btn-primary"
              eventName="book_cta_click"
              eventDetails={{ placement: `service_${service.slug}_footer` }}
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
