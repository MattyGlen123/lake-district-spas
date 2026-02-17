'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BlogPostMeta } from '@/types/blog';

const categories: BlogPostMeta['category'][] = [
  'guides',
  'comparisons',
  'seasonal',
  'facilities',
  'locations',
];

const categoryLabels: Record<BlogPostMeta['category'], string> = {
  guides: 'Guides',
  comparisons: 'Comparisons',
  seasonal: 'Seasonal',
  facilities: 'Facilities',
  locations: 'Locations',
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export default function BlogCategoryFilter({
  allPosts,
}: {
  allPosts: BlogPostMeta[];
}) {
  const [selectedCategory, setSelectedCategory] = useState<
    BlogPostMeta['category'] | null
  >(null);

  const posts = selectedCategory
    ? allPosts.filter((post) => post.category === selectedCategory)
    : allPosts;

  return (
    <>
      {/* Category Filter Tabs */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-stone-100">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-6 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                !selectedCategory
                  ? 'bg-amber-100 text-amber-900 border border-amber-200'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              All Posts
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-amber-100 text-amber-900 border border-amber-200'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {categoryLabels[category]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-stone-500 text-lg">
              No posts found in this category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block"
              >
                <article className="space-y-4">
                  {/* Featured Image */}
                  {post.featuredImage && (
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-sm border border-stone-100">
                      <Image
                        src={post.featuredImage}
                        alt={post.featuredImageAlt || post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="space-y-3">
                    {/* Category Badge */}
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold uppercase tracking-widest text-amber-700">
                        {categoryLabels[post.category]}
                      </span>
                      <span className="text-stone-300">•</span>
                      <span className="text-xs text-stone-500">
                        {post.readingTime || '5 min read'}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="font-serif text-2xl md:text-3xl text-stone-900 leading-tight group-hover:text-amber-700 transition-colors">
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-stone-600 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Date */}
                    <div className="text-xs text-stone-400 font-medium">
                      {formatDate(post.publishedAt)}
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
