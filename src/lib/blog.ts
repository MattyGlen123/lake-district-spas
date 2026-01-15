import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { BlogPostMeta, BlogPost } from '@/types/blog';

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

export function getAllBlogPosts(): BlogPostMeta[] {
  // Check if directory exists
  if (!fs.existsSync(BLOG_DIR)) {
    return [];
  }

  const files = fs.readdirSync(BLOG_DIR);
  const posts = files
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const filePath = path.join(BLOG_DIR, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(fileContent);
      const slug = file.replace('.mdx', '');
      const stats = readingTime(content);

      return {
        ...data,
        slug,
        readingTime: stats.text,
      } as BlogPostMeta;
    })
    .filter((post) => {
      // Only include published posts (publishedAt is in the past)
      const publishDate = new Date(post.publishedAt);
      return publishDate <= new Date();
    })
    .sort((a, b) => {
      // Sort by date, newest first
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });

  return posts;
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);
  const stats = readingTime(content);

  return {
    ...data,
    slug,
    content,
    readingTime: stats.text,
  } as BlogPost;
}

export function getBlogPostsByCategory(category: BlogPostMeta['category']): BlogPostMeta[] {
  return getAllBlogPosts().filter((post) => post.category === category);
}

export function getRelatedPosts(currentSlug: string, limit: number = 3): BlogPostMeta[] {
  const currentPost = getBlogPostBySlug(currentSlug);
  if (!currentPost) return [];

  const allPosts = getAllBlogPosts().filter((post) => post.slug !== currentSlug);

  // Score posts by relevance (shared tags, same category)
  const scoredPosts = allPosts.map((post) => {
    let score = 0;
    if (post.category === currentPost.category) score += 2;
    const sharedTags = post.tags.filter((tag) => currentPost.tags.includes(tag));
    score += sharedTags.length;
    return { post, score };
  });

  return scoredPosts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.post);
}

export function getAllBlogSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) {
    return [];
  }

  return fs.readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace('.mdx', ''));
}

