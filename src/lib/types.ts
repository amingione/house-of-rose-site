export type ServiceDetail = {
  id: string;
  slug: string;
  name: string;
  description: string;
  highlight: string;
  promise: string;
  details: string;
  benefits: string[];
  idealFor: string[];
  approach: string[];
  results: string[];
  consultationNote: string;
  duration: string;
  downtime: string;
  heroImage: string;
  heroImagePosition: string;
  heroAlt: string;
};

export type TestimonialItem = {
  id: string;
  quote: string;
  author: string;
  treatment: string;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type SiteContent = {
  brandName: string;
  city: string;
  state: string;
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    secondaryDescription: string;
    primaryCtaLabel: string;
    primaryCtaHref: string;
    secondaryCtaLabel: string;
    secondaryCtaHref: string;
  };
  services: ServiceDetail[];
  about: {
    heading: string;
    description: string;
    credentials: string[];
  };
  testimonials: TestimonialItem[];
  faqs: FaqItem[];
  contact: {
    phone: string;
    email: string;
    addressLine1: string;
    addressLine2: string;
    hours: string;
  };
  seo: {
    title: string;
    description: string;
  };
};

export type PackageHighlight = {
  id: string;
  title: string;
  subtitle: string;
  priceLabel: string;
  availabilityLabel: string;
};

export type PackageResult = {
  packages: PackageHighlight[];
  fromMedusa: boolean;
};
