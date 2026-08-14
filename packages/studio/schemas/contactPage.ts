import { defineField, defineType } from "sanity";

/**
 * Source-compatible singleton for legacy Contact page copy. The current
 * /contact/ route uses reviewed website content and does not query this
 * document, so these stored fields must not appear to be live controls.
 */
export const contactPage = defineType({
  name: "contactPage",
  title: "Contact Page (not published)",
  type: "document",
  __experimental_actions: ["update", "publish"],
  groups: [
    { name: "hero", title: "Hero (not published)" },
    { name: "contactInfo", title: "Contact Info (not published)" },
    { name: "form", title: "Form Intro (not published)" },
    { name: "map", title: "Map (not published)" },
    { name: "seo", title: "SEO (not published)" },
  ],
  fields: [
    // ── SEO ──
    defineField({
      name: "seoTitle",
      title: "SEO Title (not published)",
      type: "string",
      group: "seo",
      readOnly: true,
      description:
        "Stored for source compatibility. The current /contact/ route uses reviewed website content.",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description (not published)",
      type: "text",
      rows: 2,
      group: "seo",
      readOnly: true,
      description:
        "Stored for source compatibility. The current /contact/ route uses reviewed website content.",
    }),

    // ── Hero ──
    defineField({
      name: "heroKicker",
      title: "Kicker (not published)",
      type: "string",
      group: "hero",
      readOnly: true,
      description:
        "Stored for source compatibility. The current /contact/ route uses reviewed website content.",
    }),
    defineField({
      name: "heroTitle",
      title: "Title (not published)",
      type: "string",
      group: "hero",
      readOnly: true,
      description:
        "Stored for source compatibility. The current /contact/ route uses reviewed website content.",
    }),
    defineField({
      name: "heroDescription",
      title: "Description (not published)",
      type: "text",
      rows: 3,
      group: "hero",
      readOnly: true,
      description:
        "Stored for source compatibility. The current /contact/ route uses reviewed website content.",
    }),

    // ── Contact Info (3 presentational columns around the contact details) ──
    defineField({
      name: "phoneLabel",
      title: "Phone — Label (not published)",
      type: "string",
      group: "contactInfo",
      readOnly: true,
      description:
        "Stored for source compatibility. The current /contact/ route uses reviewed website content.",
    }),
    defineField({
      name: "phoneNumber",
      title: "Phone — Display Number (not published)",
      type: "string",
      group: "contactInfo",
      readOnly: true,
      description:
        "Stored for source compatibility. The current /contact/ route uses canonical website contact details.",
    }),
    defineField({
      name: "phoneHours",
      title: "Phone — Hours Line (not published)",
      type: "string",
      group: "contactInfo",
      readOnly: true,
      description:
        "Stored for source compatibility. The current /contact/ route uses reviewed website content.",
    }),

    defineField({
      name: "bookLabel",
      title: "View Services — Label (not published)",
      type: "string",
      group: "contactInfo",
      readOnly: true,
      description:
        "Stored for source compatibility. The current /contact/ route uses reviewed website content.",
    }),
    defineField({
      name: "bookLinkText",
      title: "View Services — Link Text (not published)",
      type: "string",
      group: "contactInfo",
      readOnly: true,
      description:
        "Stored for source compatibility. The current /contact/ route uses reviewed website content.",
    }),
    defineField({
      name: "bookNote",
      title: "View Services — Note Line (not published)",
      type: "string",
      group: "contactInfo",
      readOnly: true,
      description:
        "Stored for source compatibility. The current /contact/ route uses reviewed website content.",
    }),

    defineField({
      name: "visitLabel",
      title: "Visit — Label (not published)",
      type: "string",
      group: "contactInfo",
      readOnly: true,
      description:
        "Stored for source compatibility. The current /contact/ route uses reviewed website content.",
    }),
    defineField({
      name: "addressLine1",
      title: "Visit — Address Line 1 (not published)",
      type: "string",
      group: "contactInfo",
      readOnly: true,
      description:
        "Stored for source compatibility. The current /contact/ route uses canonical website contact details.",
    }),
    defineField({
      name: "addressLine2",
      title: "Visit — Address Line 2 (not published)",
      type: "string",
      group: "contactInfo",
      readOnly: true,
      description:
        "Stored for source compatibility. The current /contact/ route uses canonical website contact details.",
    }),

    // ── Form Intro (copy above the lead form — NOT the form fields) ──
    defineField({
      name: "formKicker",
      title: "Kicker (not published)",
      type: "string",
      group: "form",
      readOnly: true,
      description:
        "Stored for source compatibility. The current /contact/ route uses reviewed website content.",
    }),
    defineField({
      name: "formHeading",
      title: "Heading (not published)",
      type: "string",
      group: "form",
      readOnly: true,
      description:
        "Stored for source compatibility. The current /contact/ route uses reviewed website content.",
    }),
    defineField({
      name: "formIntro",
      title: "Intro (not published)",
      type: "text",
      rows: 2,
      group: "form",
      readOnly: true,
      description:
        "Stored for source compatibility. The current /contact/ route uses reviewed website content.",
    }),

    // ── Map / Directions ──
    defineField({
      name: "mapKicker",
      title: "Kicker (not published)",
      type: "string",
      group: "map",
      readOnly: true,
      description:
        "Stored for source compatibility. The current /contact/ route uses reviewed website content.",
    }),
    defineField({
      name: "mapHeading",
      title: "Heading (not published)",
      type: "string",
      group: "map",
      readOnly: true,
      description:
        "Stored for source compatibility. The current /contact/ route uses reviewed website content.",
    }),
    defineField({
      name: "mapCtaText",
      title: "Directions CTA Text (not published)",
      type: "string",
      group: "map",
      readOnly: true,
      description:
        "Stored for source compatibility. The current /contact/ route uses reviewed website content.",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Contact Page Content (not published)" }),
  },
});
