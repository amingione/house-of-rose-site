import type { BlogPost } from '@/lib/queries';

const REVIEWED_TITLES: Readonly<Record<string, string>> = {
  'is-morpheus8-safe': 'Is Morpheus8 Safe? What to Ask Before Treatment',
};

const REVIEWED_PUBLIC_BLOG_SLUGS = new Set(Object.keys(REVIEWED_TITLES));

/**
 * Voice-reset publication gate. A Sanity post is not public until its visible
 * copy, metadata, and schema description have been reviewed together.
 */
export function isReviewedPublicBlogSlug(slug: string): boolean {
  return REVIEWED_PUBLIC_BLOG_SLUGS.has(slug);
}

export function getPublicBlogTitle(post: Pick<BlogPost, 'slug' | 'title'>): string {
  return REVIEWED_TITLES[post.slug] ?? post.title;
}
