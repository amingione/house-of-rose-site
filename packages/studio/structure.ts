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
    ]);
