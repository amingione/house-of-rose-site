import Image from "next/image";
import Link from "next/link";

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
    id: "01",
    title: "Consultation First",
    detail:
      "Goals, anatomy, timing, and candidacy are reviewed before any treatment path is recommended.",
  },
  {
    id: "02",
    title: "Plan With Precision",
    detail:
      "Services are sequenced around your features, schedule, downtime tolerance, and maintenance rhythm.",
  },
  {
    id: "03",
    title: "Quiet, Polished Appointment Flow",
    detail:
      "Arrival, treatment, and aftercare are handled with a calm studio tempo rather than a rushed transactional pace.",
  },
  {
    id: "04",
    title: "Follow-through That Lasts",
    detail:
      "Progress checks and upkeep guidance keep the result refined well beyond the initial appointment.",
  },
] as const;

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

      <main className="lux-page experience-page">
        <section data-section="experience-hero" className="lux-hero lux-bleed">
          <Image
            src="/generated/reception-arrival-editorial.png"
            alt="House of Rose arrival lounge and hospitality setting"
            fill
            priority
            className="lux-hero-image"
          />
          <div className="lux-hero-overlay" />
          <div className="lux-hero-content experience-hero-content">
            <div className="experience-hero-copy reveal-up">
              <p className="lux-kicker">Guest Experience</p>
              <span className="lux-hero-brand">{content.brandName}</span>
              <h1>Luxury here is measured by pacing, discretion, and follow-through.</h1>
              <p>
                Every visit is built to feel private and composed, from the first
                conversation through post-treatment guidance in {content.city}, {content.state}.
              </p>
              <div className="lux-hero-actions">
                <TrackedLink
                  href={content.hero.primaryCtaHref}
                  className="lux-btn lux-btn-primary"
                  eventName="book_cta_click"
                  eventDetails={{ placement: "experience_hero" }}
                >
                  {content.hero.primaryCtaLabel}
                </TrackedLink>
                <Link href="#journey" className="lux-btn lux-btn-tertiary">
                  View the journey
                </Link>
              </div>
            </div>

            <div className="experience-hero-panel reveal-up">
              <p className="lux-kicker">What Defines The Visit</p>
              <div className="experience-hero-panel-list">
                <div>
                  <h2>Consultation-led care</h2>
                  <p>Recommendations start with fit, not urgency.</p>
                </div>
                <div>
                  <h2>Discreet arrival and treatment flow</h2>
                  <p>Calm transitions keep the appointment polished from start to finish.</p>
                </div>
                <div>
                  <h2>Aftercare with continuity</h2>
                  <p>Follow-up guidance is treated as part of the experience, not an afterthought.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          data-section="experience-philosophy"
          className="lux-section lux-bleed editorial-band experience-philosophy"
        >
          <div className="shell editorial-band-grid experience-philosophy-grid">
            <div className="editorial-copy experience-philosophy-copy reveal-up">
              <p className="lux-kicker">Philosophy</p>
              <h2>Clinical precision should still feel warm, tailored, and deeply considered.</h2>
              <p>
                The House of Rose experience is designed around clarity. You should know
                why a treatment is being recommended, what recovery realistically looks
                like, and how to maintain the result without feeling oversold.
              </p>
              <div className="editorial-list">
                <p>Recommendations are paced around your goals, anatomy, and calendar.</p>
                <p>Environment, hospitality, and education are treated as one seamless system.</p>
                <p>Results are supported with thoughtful follow-up instead of one-visit thinking.</p>
              </div>
            </div>

            <div className="editorial-image-stack experience-philosophy-media reveal-up">
              <div className="editorial-primary-image">
                <Image
                  src="/generated/hydration-wellness-editorial.png"
                  alt="Wellness lounge with hospitality details"
                  fill
                  className="fit-image"
                />
              </div>
              <div className="editorial-secondary-image">
                <Image
                  src="/generated/skin-renewal-editorial.png"
                  alt="Treatment room detail at House of Rose"
                  fill
                  className="fit-image"
                />
              </div>
            </div>
          </div>
        </section>

        <section data-section="experience-journey" className="lux-section shell" id="journey">
          <div className="lux-section-head reveal-up">
            <p className="lux-kicker">The Journey</p>
            <h2>A four-part sequence that keeps every decision clear and every visit composed.</h2>
            <p>
              From the moment you inquire to the way results are maintained, each step is
              structured to feel deliberate, informative, and calm.
            </p>
          </div>

          <div className="experience-journey-grid">
            {EXPERIENCE_STEPS.map((step) => (
              <article key={step.id} className="experience-step-card reveal-up">
                <p className="experience-step-number">{step.id}</p>
                <h3>{step.title}</h3>
                <p>{step.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section data-section="experience-cta" className="lux-section shell">
          <div className="lux-final-cta experience-cta-card reveal-up">
            <p className="lux-kicker">Plan Your Visit</p>
            <h2>Book a private consultation built around your features, pace, and goals.</h2>
            <p>
              Meet with {content.brandName} in {content.city}, {content.state} for a
              treatment plan that balances visible refinement with realistic maintenance.
            </p>
            <div className="experience-cta-actions">
              <TrackedLink
                href={content.hero.primaryCtaHref}
                className="lux-btn lux-btn-primary"
                eventName="book_cta_click"
                eventDetails={{ placement: "experience_cta" }}
              >
                {content.hero.primaryCtaLabel}
              </TrackedLink>
              <Link href="/services" className="lux-btn lux-btn-secondary">
                Explore services
              </Link>
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
