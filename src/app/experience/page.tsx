import Image from "next/image";

import { EngagementTracker } from "@/components/EngagementTracker";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { TrackedLink } from "@/components/TrackedLink";
import { getSiteContent } from "@/lib/sanity";

export const metadata = {
  title: "Experience",
  description:
    "Discover the House of Rose guest journey from consultation through follow-up care in Punta Gorda, Florida.",
};

const EXPERIENCE_STEPS = [
  {
    id: "consult",
    title: "Private Consultation",
    detail:
      "Goals, anatomy, and timeline are reviewed in detail before any recommendation is made.",
  },
  {
    id: "plan",
    title: "Tailored Treatment Plan",
    detail:
      "Services are selected for your features and lifestyle, with transparent guidance on downtime and pacing.",
  },
  {
    id: "result",
    title: "Refined Follow-through",
    detail:
      "Aftercare, progress checks, and maintenance strategy are aligned to keep outcomes polished over time.",
  },
];

export default async function ExperiencePage() {
  const content = await getSiteContent();

  return (
    <>
      <EngagementTracker page="experience" />
      <SiteHeader
        brandName={content.brandName}
        primaryCtaHref={content.hero.primaryCtaHref}
        primaryCtaLabel={content.hero.primaryCtaLabel}
      />

      <main className="lux-page">
        <section className="lux-hero">
          <Image
            src="/generated/reception-arrival-editorial.png"
            alt="House of Rose arrival and hospitality experience"
            fill
            priority
            className="lux-hero-image"
          />
          <div className="lux-hero-overlay" />
          <div className="shell lux-hero-content reveal-up">
            <p className="lux-kicker">Guest Experience</p>
            <span className="lux-hero-brand">{content.brandName}</span>
            <h1>Every visit is designed to feel private, polished, and unrushed.</h1>
            <p>
              From the first consultation through follow-up, House of Rose is built around
              thoughtful pacing, clinical precision, and a boutique hospitality standard.
            </p>
            <TrackedLink
              href={content.hero.primaryCtaHref}
              className="lux-btn lux-btn-primary"
              eventName="book_cta_click"
              eventDetails={{ placement: "experience_hero" }}
            >
              {content.hero.primaryCtaLabel}
            </TrackedLink>
          </div>
        </section>

        <section className="lux-section shell">
          <div className="lux-section-head reveal-up">
            <p className="lux-kicker">Your Journey</p>
            <h2>A concierge-style flow that puts clarity and comfort first.</h2>
          </div>
          <div className="lux-step-grid">
            {EXPERIENCE_STEPS.map((step) => (
              <article key={step.id} className="lux-step-item reveal-up">
                <p className="lux-step-index">{step.id.toUpperCase()}</p>
                <h3>{step.title}</h3>
                <p>{step.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="lux-section shell lux-editorial-grid">
          <div className="lux-editorial-image reveal-up">
            <Image
              src="/generated/hydration-wellness-editorial.png"
              alt="Wellness lounge atmosphere"
              fill
              className="fit-image"
            />
          </div>
          <div className="lux-editorial-copy reveal-up">
            <p className="lux-kicker">Studio Standard</p>
            <h2>Clinical credibility without a transactional atmosphere.</h2>
            <p>
              The House of Rose standard blends elevated environment design with meticulous
              treatment planning, so your experience feels as considered as your result.
            </p>
            <div className="lux-list">
              <p>Consultation-first recommendations with no rushed treatment pressure</p>
              <p>Clear guidance on timing, downtime, and maintenance expectations</p>
              <p>Discreet, high-touch flow from arrival through follow-up</p>
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
