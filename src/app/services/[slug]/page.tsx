import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { EngagementTracker } from "@/components/EngagementTracker";
import { TrackedLink } from "@/components/TrackedLink";
import { getServiceBySlug, getSiteContent } from "@/lib/sanity";

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

  return (
    <>
      <EngagementTracker page={`service_${service.slug}`} />
      <main className="service-detail-page">
        <section className="service-hero service-hero-editorial">
          <Image
            src={service.heroImage}
            alt={service.heroAlt}
            fill
            priority
            className="hero-bg"
            style={{ objectPosition: service.heroImagePosition }}
          />
          <div className="hero-overlay hero-overlay-editorial" />
          <div className="hero-content service-hero-content reveal-up shell">
            <p className="eyebrow">{content.brandName}</p>
            <h1>{service.name}</h1>
            <p className="hero-copy">{service.promise}</p>
            <div className="service-hero-facts">
              <p>
                <span>Typical session</span>
                {service.duration}
              </p>
              <p>
                <span>Downtime</span>
                {service.downtime}
              </p>
            </div>
            <div className="hero-actions">
              <TrackedLink
                href={content.hero.primaryCtaHref}
                className="btn-primary"
                eventName="book_cta_click"
                eventDetails={{ placement: `service_${service.slug}` }}
              >
                {content.hero.primaryCtaLabel}
              </TrackedLink>
              <Link href="/services" className="btn-secondary">
                View all services
              </Link>
            </div>
          </div>
        </section>

        <section className="section shell service-story-grid">
          <article className="service-story-card reveal-up">
            <p className="kicker">Why Clients Choose It</p>
            <h2>{service.highlight}</h2>
            <p>{service.details}</p>
          </article>
          <article className="service-story-card reveal-up">
            <p className="kicker">What It Addresses</p>
            <ul>
              {service.results.map((result) => (
                <li key={result}>{result}</li>
              ))}
            </ul>
          </article>
        </section>

        <section className="section shell service-editorial-layout">
          <div className="service-editorial-image reveal-up">
            <Image
              src={service.heroImage}
              alt={service.heroAlt}
              fill
              className="fit-image"
              style={{ objectPosition: service.heroImagePosition }}
            />
          </div>
          <div className="service-editorial-copy reveal-up">
            <p className="kicker">The House of Rose Approach</p>
            <h2>A treatment plan designed around your features, not a template.</h2>
            <div className="service-editorial-list">
              {service.approach.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
            <p className="consult-note">{service.consultationNote}</p>
          </div>
        </section>

        <section className="section shell service-detail-grid service-detail-grid-editorial">
          <article className="service-detail-card reveal-up">
            <p className="kicker">Ideal For</p>
            <ul>
              {service.idealFor.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="service-detail-card reveal-up">
            <p className="kicker">Benefits</p>
            <ul>
              {service.benefits.map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>
          </article>

          <article className="service-detail-card reveal-up">
            <p className="kicker">What To Expect</p>
            <p className="detail-stat">
              <strong>Appointment time</strong>
              {service.duration}
            </p>
            <p className="detail-stat">
              <strong>Downtime</strong>
              {service.downtime}
            </p>
            <p>
              Your consultation covers candidacy, expected recovery, treatment pacing, and
              whether any complementary services should be considered.
            </p>
          </article>
        </section>

        <section className="section shell service-detail-footer reveal-up">
          <p className="kicker">Begin With Consultation</p>
          <h2>Discuss {service.name.toLowerCase()} in a setting that feels as tailored as the result.</h2>
          <p>
            Schedule a private appointment at {content.brandName} in {content.city},{" "}
            {content.state}.
          </p>
          <TrackedLink
            href={content.hero.primaryCtaHref}
            className="btn-primary"
            eventName="book_cta_click"
            eventDetails={{ placement: `service_${service.slug}_footer` }}
          >
            {content.hero.primaryCtaLabel}
          </TrackedLink>
        </section>
      </main>
    </>
  );
}
