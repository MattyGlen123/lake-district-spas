import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import BlogCard from '@/components/BlogCard';
import { getAllBlogPosts } from '@/lib/blog';

interface FeaturedArticlesProps {
  excludeSlug?: string;
  useWhiteBackground?: boolean;
}

export default function FeaturedArticles({
  excludeSlug,
  useWhiteBackground = false,
}: FeaturedArticlesProps) {
  // getAllBlogPosts() returns posts sorted newest-first with unpublished filtered out
  const posts = getAllBlogPosts()
    .filter((p) => p.slug !== excludeSlug)
    .slice(0, 2);

  if (posts.length === 0) return null;

  return (
    <section className={`${useWhiteBackground ? 'bg-white' : 'bg-slate-50'} py-32`}>
      <div className="container mx-auto px-4 md:px-8">
        {/* Section Heading */}
        <div className="mb-16">
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-px w-12 bg-amber-700 opacity-30" />
            <span className="text-xs font-bold uppercase tracking-[0.4em] text-amber-700">
              From The Blog
            </span>
          </div>
          <div className="flex items-end justify-between">
            <h2 className="font-serif text-4xl md:text-5xl text-stone-900">
              Latest Spa Guides
            </h2>
            <Link
              href="/blog"
              className="text-stone-900 font-semibold flex items-center text-sm"
            >
              View All Articles
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>

        {/* Blog Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-8">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
