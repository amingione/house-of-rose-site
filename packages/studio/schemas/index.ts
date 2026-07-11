import { siteSettings } from './siteSettings';
import { homepage } from './homepage';
import { thankYou } from './thankYou';
import { skinAnalysis } from './skinAnalysis';
import { contactPage } from './contactPage';
import { privacyPolicy } from './privacyPolicy';
import { rentARoom } from './rentARoom';
import { professionalMakeupPage } from './professionalMakeupPage';
import { janeIredalePage } from './janeIredalePage';
import { makeupEventsPage } from './makeupEventsPage';
import { experienceContent } from './experienceContent';
import { serviceCollection } from './serviceCollection';
import { service } from './service';
import { concern } from './concern';
import { product } from './product';
import { promotion } from './promotion';
import { shopBrand } from './shopBrand';
import { blogPost } from './blogPost';
import { leadSubmission } from './leadSubmission';
import { order } from './order';
import { brandProfile } from './brandProfile';
import { provider } from './provider';
import { treatmentPackage } from './treatmentPackage';
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
  homepage,
  thankYou,
  skinAnalysis,
  contactPage,
  privacyPolicy,
  rentARoom,
  professionalMakeupPage,
  janeIredalePage,
  makeupEventsPage,
  experienceContent,
  // Content
  serviceCollection,
  service,
  concern,
  product,
  promotion,
  shopBrand,
  blogPost,
  leadSubmission,
  order,
  // Brand & growth (Luxe Aesthetics Advisor) — mirrors Notion service system
  brandProfile,
  provider,
  treatmentPackage,
  // Marketing / SEO / AEO page types — see docs/CONTENT-MODEL-MAP.md
  costGuide,
  comparison,
  localArea,
  caseStudy,
];
