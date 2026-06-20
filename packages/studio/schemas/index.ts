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
import { treatmentPackage } from './treatmentPackage';
import { membership } from './membership';

export const schemaTypes = [
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
  // Brand & growth (Luxe Aesthetics Advisor)
  brandProfile,
  treatmentPackage,
  membership,
];
