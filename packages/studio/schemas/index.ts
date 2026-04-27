import { siteSettings } from './siteSettings';
import { experienceContent } from './experienceContent';
import { serviceCollection } from './serviceCollection';
import { service } from './service';
import { product } from './product';
import { testimonial } from './testimonial';

export const schemaTypes = [
  // Singletons
  siteSettings,
  experienceContent,
  // Content
  serviceCollection,
  service,
  product,
  testimonial,
];
