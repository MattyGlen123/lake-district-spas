export interface BlogPostMeta {
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  category: 'guides' | 'comparisons' | 'seasonal' | 'facilities' | 'locations';
  tags: string[];
  featuredImage?: string;
  featuredImageAlt?: string;
  seoTitle?: string;
  seoDescription?: string;
  relatedSpas?: string[]; // spa slugs for internal linking
  readingTime?: string;
}

export interface BlogPost extends BlogPostMeta {
  content: string;
}

export interface BlogTopic {
  id: string;
  title: string;
  slug: string;
  targetKeyword: string;
  category: BlogPostMeta['category'];
  priority: number;
  status: 'planned' | 'in-progress' | 'published';
  relatedSpas: string[];
  notes?: string;
}

