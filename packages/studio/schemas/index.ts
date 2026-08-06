import { siteSettings } from './siteSettings';
import { homepage } from './homepage';
import { thankYou } from './thankYou';
import { skinAnalysis } from './skinAnalysis';
import { contactPage } from './contactPage';
import { supportPage } from './supportPage';
import { termsOfService } from './termsOfService';
import { privacyPolicy } from './privacyPolicy';
import { rentARoom } from './rentARoom';
import { janeIredalePage } from './janeIredalePage';
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
// Treatment-page blocks (downtime, aftercare, provider scope, price range)
import { treatmentObjectTypes } from './objects/treatmentBlocks';
import { costGuide } from './costGuide';
import { comparison } from './comparison';
import { localArea } from './localArea';
import { caseStudy } from './caseStudy';

export const schemaTypes = [
  // Shared objects
  seo,
  faq,
  ...treatmentObjectTypes,
  // Singletons
  siteSettings,
  homepage,
  thankYou,
  skinAnalysis,
  contactPage,
  supportPage,
  termsOfService,
  privacyPolicy,
  rentARoom,
  janeIredalePage,
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
