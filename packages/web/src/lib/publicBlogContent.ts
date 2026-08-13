import type { BlogPost } from '@/lib/queries';

const REVIEWED_TITLES: Readonly<Record<string, string>> = {
  'is-morpheus8-safe': 'Is Morpheus8 Safe? What to Ask Before Treatment',
};

export function getPublicBlogTitle(post: Pick<BlogPost, 'slug' | 'title'>): string {
  return REVIEWED_TITLES[post.slug] ?? post.title;
}
