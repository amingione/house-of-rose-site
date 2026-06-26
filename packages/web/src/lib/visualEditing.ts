/**
 * Netlify Visual Editor — inline annotation helpers.
 *
 * These emit the `data-sb-object-id` / `data-sb-field-path` attributes the
 * Visual Editor uses to map DOM elements back to Sanity documents and fields,
 * enabling click-to-edit on the live preview.
 *
 * They are inert in production: the attributes are plain `data-*` and have no
 * runtime cost or effect outside the editor iframe. The static
 * `output: 'static'` build is unaffected.
 *
 * USAGE (Astro) — spread the returned object onto an element:
 *
 *   ---
 *   import { sbObjectId, sbFieldPath } from "@/lib/visualEditing";
 *   const { _id, title, body } = service;
 *   ---
 *   <article {...sbObjectId(_id)}>
 *     <h1 {...sbFieldPath("title")}>{title}</h1>
 *     <div {...sbFieldPath("body")}><PortableText value={body} /></div>
 *   </article>
 *
 * Field paths are relative to the nearest ancestor that carries an object id.
 * Netlify Visual Editor addresses array items by their numeric INDEX (the Sanity
 * CSI maps index -> _key when persisting), e.g. `faqs.0.answer`. Build indexed
 * paths with {@link sbFieldPathParts}: sbFieldPathParts("faqs", i, "answer").
 *
 * To annotate a page-backed route, include `_id` in its GROQ projection
 * (see packages/web/src/lib/queries.ts).
 */

/** Marks the element as the root of a Sanity document (object). */
export function sbObjectId(documentId: string): Record<'data-sb-object-id', string> {
  return { 'data-sb-object-id': documentId };
}

/** Marks the element as a single field, relative to the nearest object id. */
export function sbFieldPath(path: string): Record<'data-sb-field-path', string> {
  return { 'data-sb-field-path': path };
}

/** Joins segments into a dotted field path, e.g. ["faqs", key, "answer"]. */
export function sbFieldPathParts(...parts: Array<string | number>): Record<'data-sb-field-path', string> {
  return { 'data-sb-field-path': parts.join('.') };
}

/**
 * Convenience: annotate an element as BOTH a document root and a field in one
 * spread (e.g. the document container that also represents its `title`).
 */
export function sbObjectField(
  documentId: string,
  path: string,
): Record<'data-sb-object-id' | 'data-sb-field-path', string> {
  return { 'data-sb-object-id': documentId, 'data-sb-field-path': path };
}
