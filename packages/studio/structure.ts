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

      // Active singletons — standalone public pages
      S.listItem()
        .title('Pages')
        .child(
          S.list()
            .title('Pages')
            .items([
              S.listItem().title('About Section').id('aboutPage')
                .child(S.document().schemaType('aboutPage').documentId('aboutPage')),
              S.listItem().title('Rent a Room Page').id('rentARoom')
                .child(S.document().schemaType('rentARoom').documentId('rentARoom')),
              S.listItem().title('Privacy Policy Page').id('privacyPolicy')
                .child(S.document().schemaType('privacyPolicy').documentId('privacyPolicy')),
              S.listItem().title('Terms of Service Page').id('termsOfService')
                .child(S.document().schemaType('termsOfService').documentId('termsOfService')),
            ])
        ),

      S.listItem()
        .title('Providers')
        .schemaType('provider')
        .child(S.documentTypeList('provider').title('Providers')),

      S.divider(),

      // Products
      S.listItem()
        .title('Products (storefront disabled)')
        .schemaType('product')
        .child(S.documentTypeList('product').title('Products (storefront disabled)')),

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
