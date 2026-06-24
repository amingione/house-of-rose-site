import type { StructureBuilder, StructureResolverContext } from 'sanity/structure';

export const structure = (S: StructureBuilder, _ctx: StructureResolverContext) =>
  S.list()
    .title('House of Rose')
    .items([
      // Singleton — Site Settings
      S.listItem()
        .title('Site Settings')
        .id('siteSettings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
        ),

      // Singleton — Home Page
      S.listItem()
        .title('Home Page')
        .id('homepage')
        .child(
          S.document()
            .schemaType('homepage')
            .documentId('homepage')
        ),

      // Singletons — standalone marketing pages
      S.listItem()
        .title('Pages')
        .child(
          S.list()
            .title('Pages')
            .items([
              S.listItem().title('Experience Page').id('experiencePage')
                .child(S.document().schemaType('experienceContent').documentId('experienceContent')),
              S.listItem().title('Memberships Page').id('membershipsPage')
                .child(S.document().schemaType('membershipsPage').documentId('membershipsPage')),
              S.listItem().title('Skin Analysis Page').id('skinAnalysis')
                .child(S.document().schemaType('skinAnalysis').documentId('skinAnalysis')),
              S.listItem().title('Rent a Room Page').id('rentARoom')
                .child(S.document().schemaType('rentARoom').documentId('rentARoom')),
              S.listItem().title('Contact Page').id('contactPage')
                .child(S.document().schemaType('contactPage').documentId('contactPage')),
              S.listItem().title('Privacy Policy Page').id('privacyPolicy')
                .child(S.document().schemaType('privacyPolicy').documentId('privacyPolicy')),
              S.listItem().title('Thank You Page').id('thankYou')
                .child(S.document().schemaType('thankYou').documentId('thankYou')),
            ])
        ),

      S.divider(),

      // Services
      S.listItem()
        .title('Service Collections')
        .schemaType('serviceCollection')
        .child(S.documentTypeList('serviceCollection').title('Collections')),

      S.listItem()
        .title('Services')
        .schemaType('service')
        .child(S.documentTypeList('service').title('Services')),

      S.divider(),

      // Products
      S.listItem()
        .title('Products')
        .schemaType('product')
        .child(S.documentTypeList('product').title('Products')),

      S.divider(),

      // Marketing / SEO / AEO page types — see docs/SEO-AEO-PLAYBOOK.md
      S.listItem()
        .title('Marketing / SEO')
        .child(
          S.list()
            .title('Marketing / SEO')
            .items([
              S.listItem()
                .title('Cost Guides')
                .schemaType('costGuide')
                .child(S.documentTypeList('costGuide').title('Cost Guides')),
              S.listItem()
                .title('Comparisons')
                .schemaType('comparison')
                .child(S.documentTypeList('comparison').title('Comparisons')),
              S.listItem()
                .title('Local Areas')
                .schemaType('localArea')
                .child(S.documentTypeList('localArea').title('Local Areas')),
              S.listItem()
                .title('Case Studies (Before/After)')
                .schemaType('caseStudy')
                .child(S.documentTypeList('caseStudy').title('Case Studies')),
            ])
        ),

      S.divider(),

      S.listItem()
        .title('Lead Submissions')
        .schemaType('leadSubmission')
        .child(
          S.documentTypeList('leadSubmission')
            .title('Lead Submissions')
            .defaultOrdering([{ field: 'submittedAt', direction: 'desc' }])
        ),
    ]);
