import { siteSettings } from './siteSettings';
import { experienceContent } from './experienceContent';
import { serviceCollection } from './serviceCollection';
import { service } from './service';
import { concern } from './concern';
import { product } from './product';
import { testimonial } from './testimonial';
import { blogPost } from './blogPost';
import { leadSubmission } from './leadSubmission';
import { brandProfile } from './brandProfile';
import { provider } from './provider';
import { treatmentPackage } from './treatmentPackage';
import { membership } from './membership';
// Shared objects + AEO page types — see docs/SEO-AEO-PLAYBOOK.md
import { seo } from './objects/seo';
import { faq } from './objects/faq';
import { costGuide } from './costGuide';
import { comparison } from './comparison';
import { localArea } from './localArea';
import { caseStudy } from './caseStudy';

export const schemaTypes = [
  // Shared objects
  seo,
  faq,
  // Singletons
  siteSettings,
  experienceContent,
  // Content
  serviceCollection,
  service,
  concern,
  product,
  testimonial,
  blogPost,
  leadSubmission,
  // Brand & growth (Luxe Aesthetics Advisor) — mirrors Notion service system
  brandProfile,
  provider,
  treatmentPackage,
  membership,
  // Marketing / SEO / AEO page types — see docs/CONTENT-MODEL-MAP.md
  costGuide,
  comparison,
  localArea,
  caseStudy,
];
