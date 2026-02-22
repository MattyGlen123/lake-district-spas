'use client';

import { useState } from 'react';
import { BlogPostMeta } from '@/types/blog';
import BlogCard from '@/components/BlogCard';

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
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
