import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { EngagementTracker } from "@/components/EngagementTracker";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { TrackedLink } from "@/components/TrackedLink";
import { getSiteContent } from "@/lib/sanity";
import {
  getServiceCollectionBySlug,
  getServiceCollections,
} from "@/lib/service-collections";

type CollectionPageProps = {
  params: Promise<{ collection: string }>;
};

export async function generateStaticParams() {
  const content = await getSiteContent();

  return getServiceCollections(content).map((collection) => ({
    collection: collection.slug,
  }));
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { collection: collectionSlug } = await params;
  const content = await getSiteContent();
  const collection = getServiceCollectionBySlug(content, collectionSlug);

  if (!collection) {
    return {
      title: "Service House Not Found",
    };
  }

  return {
    title: `${collection.name} Services`,
    description: collection.description,
    openGraph: {
      title: `${collection.name} | ${content.brandName}`,
      description: collection.description,
      images: [
        {
          url: collection.heroImage,
          alt: collection.heroAlt,
        },
      ],
    },
  };
}

export default async function CollectionDetailPage({ params }: CollectionPageProps) {
  const { collection: collectionSlug } = await params;
  const content = await getSiteContent();
  const collection = getServiceCollectionBySlug(content, collectionSlug);

  if (!collection) {
    notFound();
  }

  return (
    <>
      <EngagementTracker page={`collection_${collection.slug}`} />
      <SiteHeader
        brandName={content.brandName}
        primaryCtaHref={content.hero.primaryCtaHref}
        primaryCtaLabel={content.hero.primaryCtaLabel}
      />

      <main className="lux-page">
        <section className="lux-hero">
          <Image
            src={collection.heroImage}
            alt={collection.heroAlt}
            fill
            priority
            className="lux-hero-image"
            style={{ objectPosition: collection.heroImagePosition }}
          />
          <div className="lux-hero-overlay" />
          <div className="shell lux-hero-content reveal-up">
            <p className="lux-kicker">Service House</p>
            <span className="lux-hero-brand">{collection.name}</span>
            <h1>{collection.headline}</h1>
            <p>{collection.description}</p>
            <div className="lux-hero-actions">
              <TrackedLink
                href={content.hero.primaryCtaHref}
                className="lux-btn lux-btn-primary"
                eventName="book_cta_click"
                eventDetails={{ placement: `collection_${collection.slug}_hero` }}
              >
                {content.hero.primaryCtaLabel}
              </TrackedLink>
              <Link href="/services" className="lux-btn lux-btn-tertiary">
                Browse all services
              </Link>
            </div>
          </div>
        </section>

        <section className="lux-section shell">
          <div className="lux-section-head reveal-up">
            <p className="lux-kicker">Included Services</p>
            <h2>Choose your starting point.</h2>
          </div>
          <div className="collection-service-grid">
            {collection.services.map((service) => (
              <article className="collection-service-card reveal-up" key={service.slug}>
                <div className="collection-service-image">
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
                  eventDetails={{ service: service.slug, placement: `collection_${collection.slug}` }}
                >
                  Read service page
                </TrackedLink>
              </article>
            ))}
          </div>
        </section>

        <section className="lux-section shell lux-process-section">
          <div className="lux-section-head reveal-up">
            <p className="lux-kicker">How It Works</p>
            <h2>Consult, design, and deliver with intention.</h2>
          </div>
          <div className="lux-step-grid">
            <article className="lux-step-item reveal-up">
              <p className="lux-step-index">DISCOVERY</p>
              <h3>Clarify goals and candidacy</h3>
              <p>
                We begin with anatomy, goals, and timing so recommendations stay realistic
                and clinically appropriate.
              </p>
            </article>
            <article className="lux-step-item reveal-up">
              <p className="lux-step-index">DESIGN</p>
              <h3>Shape your custom treatment map</h3>
              <p>
                Services are layered only when useful, with clear guidance on recovery,
                pacing, and maintenance.
              </p>
            </article>
            <article className="lux-step-item reveal-up">
              <p className="lux-step-index">DELIVERY</p>
              <h3>Execute with refinement</h3>
              <p>
                Treatment and follow-through are handled in a high-touch setting focused on
                polished, believable outcomes.
              </p>
            </article>
          </div>
        </section>

        <section className="lux-section shell lux-final-cta reveal-up">
          <p className="lux-kicker">Begin with Consultation</p>
          <h2>{collection.ctaLine}</h2>
          <p>
            Schedule your private consultation at {content.brandName} in {content.city}, {" "}
            {content.state}.
          </p>
          <TrackedLink
            href={content.hero.primaryCtaHref}
            className="lux-btn lux-btn-primary"
            eventName="book_cta_click"
            eventDetails={{ placement: `collection_${collection.slug}_footer` }}
          >
            {content.hero.primaryCtaLabel}
          </TrackedLink>
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
