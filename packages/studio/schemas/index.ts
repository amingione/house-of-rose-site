import { siteSettings } from './siteSettings';
import { serviceCollection } from './serviceCollection';
import { service } from './service';
import { product } from './product';

export const schemaTypes = [
  // Singleton
  siteSettings,
  // Content
  serviceCollection,
  service,
  product,
];
