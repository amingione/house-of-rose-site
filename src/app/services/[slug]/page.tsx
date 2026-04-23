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
  const processSupport = [
    `Every ${service.name.toLowerCase()} plan starts with candidacy, anatomy, and timing so the recommendation reflects your features and goals.`,
    "Treatment is paced conservatively and explained clearly, with room to layer only when it improves the overall finish.",
    "Aftercare, recovery expectations, and long-term maintenance are mapped before you commit so the result stays realistic to maintain.",
  ];
  const serviceFaqs = [
    {
      id: `${service.slug}-faq-consultation`,
      question:
        content.faqs[0]?.question ??
        `Do I need a consultation before ${service.name.toLowerCase()}?`,
      answer: `${content.faqs[0]?.answer ?? ""} ${service.consultationNote}`.trim(),
    },
    {
      id: `${service.slug}-faq-timing`,
      question: `What should I plan around timing and downtime for ${service.name.toLowerCase()}?`,
      answer: `${service.name} appointments typically take ${service.duration}. Downtime is ${service.downtime}. Your consultation covers pacing, aftercare, and whether complementary services should be staged separately.`,
    },
    {
      id: `${service.slug}-faq-results`,
      question: content.faqs[2]?.question ?? "How natural are the results?",
      answer:
        content.faqs[2]?.answer ??
        "Results are designed to look polished, balanced, and never overdone.",
    },
  ];

  return (
    <>
      <EngagementTracker page={`service_${service.slug}`} />
      <SiteHeader
        brandName={content.brandName}
        primaryCtaHref={content.hero.primaryCtaHref}
        primaryCtaLabel={content.hero.primaryCtaLabel}
      />

      <main className="lux-page service-detail-page">
        <section data-section="service-detail-hero" className="lux-hero lux-bleed">
          <Image
            src={service.heroImage}
            alt={service.heroAlt}
            fill
            priority
            className="lux-hero-image"
            style={{ objectPosition: service.heroImagePosition }}
          />
          <div className="lux-hero-overlay" />
          <div className="service-hero-content reveal-up">
            <p className="lux-kicker">Signature Service</p>
            <span className="lux-hero-brand">{service.name}</span>
            <h1>{service.highlight}</h1>
            <p>{service.promise}</p>
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

        <section
          data-section="service-detail-intro"
          className="lux-section shell service-detail-intro"
        >
          <div className="lux-section-head reveal-up">
            <p className="lux-kicker">Overview</p>
            <h2>What {service.name.toLowerCase()} is designed to do.</h2>
            <p>
              The page below frames candidacy, expected results, and how House of Rose
              approaches the service before specific treatment decisions are made in
              consultation.
            </p>
          </div>
          <div className="service-story-grid">
            <article className="service-story-card reveal-up">
            <p className="lux-kicker">Why Clients Choose It</p>
            <h2>{service.name}</h2>
            <p>{service.details}</p>
          </article>
            <article className="service-story-card reveal-up">
            <p className="lux-kicker">What It Addresses</p>
            <ul>
              {service.results.map((result) => (
                <li key={result}>{result}</li>
              ))}
            </ul>
          </article>
            <article className="service-story-card reveal-up">
            <p className="lux-kicker">Ideal For</p>
            <ul>
              {service.idealFor.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          </div>
        </section>

        <section
          data-section="service-detail-process"
          className="lux-section lux-bleed editorial-band"
        >
          <div className="shell service-process-layout">
            <div className="service-editorial-image reveal-up">
              <Image
                src={service.heroImage}
                alt={service.heroAlt}
                fill
                className="fit-image"
                style={{ objectPosition: service.heroImagePosition }}
              />
            </div>
            <div className="service-process-copy reveal-up">
              <p className="lux-kicker">Process</p>
              <h2>How the treatment is planned, delivered, and followed through.</h2>
              <p>
                Every service begins with a candid conversation about features, timing,
                and outcome. The goal is a treatment map that feels refined in real life,
                not improvised in the room.
              </p>
              <p className="subtle-note">{service.consultationNote}</p>
            </div>
          </div>
          <div className="shell service-detail-grid service-process-grid">
            {service.approach.map((item, index) => (
              <article className="service-detail-card reveal-up" key={item}>
                <p className="lux-kicker">Step {index + 1}</p>
                <h3>{item}</h3>
                <p>{processSupport[index] ?? processSupport[processSupport.length - 1]}</p>
              </article>
            ))}
          </div>
        </section>

        <section data-section="service-detail-faq" className="lux-section shell">
          <div className="lux-section-head reveal-up">
            <p className="lux-kicker">FAQ</p>
            <h2>Questions clients usually ask before booking.</h2>
          </div>
          <div className="service-faq-layout">
            <article className="service-detail-card service-faq-card reveal-up">
              <p className="lux-kicker">What To Expect</p>
              <h3>Know the appointment, downtime, and decision points ahead of time.</h3>
              <p className="service-meta">Appointment: {service.duration}</p>
              <p className="service-meta">Downtime: {service.downtime}</p>
              <p>
                Your consultation covers candidacy, anticipated recovery, and whether this
                service should be layered with complementary options or staged over time.
              </p>
            </article>
            <div className="service-faq-list">
              {serviceFaqs.map((faq) => (
                <details className="faq-item reveal-up" key={faq.id}>
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section data-section="service-detail-related" className="lux-section shell">
          <div className="lux-section-head reveal-up">
            <p className="lux-kicker">Related Services</p>
            <h2>Continue with complementary pages and service houses.</h2>
          </div>
          <div className="service-related-layout">
            <article className="service-detail-card service-related-card reveal-up">
              <p className="lux-kicker">Benefits</p>
              <h3>Why this service stays in demand.</h3>
              <ul>
                {service.benefits.map((benefit) => (
                  <li key={benefit}>{benefit}</li>
                ))}
              </ul>
            </article>
            <article className="service-detail-card service-related-card reveal-up">
              <p className="lux-kicker">Service Houses</p>
              <h3>See where it fits in the larger treatment map.</h3>
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
            {relatedServices.map((related) => (
              <article
                key={related.slug}
                className="service-detail-card service-related-card reveal-up"
              >
                <p className="service-name">{related.name}</p>
                <h3>{related.highlight}</h3>
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

        <section data-section="service-detail-cta" className="lux-section shell">
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
