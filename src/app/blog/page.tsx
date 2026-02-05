import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getAllBlogPosts, getBlogPostsByCategory } from '@/lib/blog';
import { BlogPostMeta } from '@/types/blog';

// Force static generation with ISR (revalidate every hour)
// This ensures the page is pre-rendered at build time and regenerated periodically
export const revalidate = 3600; // Revalidate every hour (3600 seconds)

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = 'https://lakedistrictspas.co.uk';

  return {
    title: 'Lake District Spa Guides & Tips - Blog',
    description:
      'Expert guides, comparisons, and insider tips to plan your perfect Lake District spa break, from facilities and access policies to the best spas.',
    alternates: {
      canonical: `${baseUrl}/blog`,
    },
    openGraph: {
      title: 'Lake District Spa Guides & Tips - Blog',
      description:
        'Expert guides, comparisons, and insider tips to plan your perfect Lake District spa break.',
      type: 'website',
      url: `${baseUrl}/blog`,
      images: [
        {
          url: `${baseUrl}/images/lake-district-spas_hero.jpg`,
          width: 1200,
          height: 630,
          alt: 'Lake District Spa Guides & Tips - Blog',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Lake District Spa Guides & Tips - Blog',
      description:
        'Expert guides, comparisons, and insider tips to plan your perfect Lake District spa break.',
      images: [`${baseUrl}/images/lake-district-spas_hero.jpg`],
    },
  };
}

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

export default function BlogPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const selectedCategory = searchParams.category as BlogPostMeta['category'] | undefined;
  const allPosts = getAllBlogPosts();
  const posts = selectedCategory
    ? getBlogPostsByCategory(selectedCategory)
    : allPosts;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-soft-cream to-background border-b border-stone-100">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-stone-900 mb-6">
              Lake District Spa Guides
            </h1>
            <p className="text-lg md:text-xl text-stone-600 max-w-2xl">
              Expert tips, comparisons, and insider knowledge to help you plan
              your perfect spa break in the Lake District.
            </p>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-stone-100">
          <div className="container mx-auto px-4">
            <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide">
              <Link
                href="/blog"
                className={`px-6 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                  !selectedCategory
                    ? 'bg-amber-100 text-amber-900 border border-amber-200'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                All Posts
              </Link>
              {categories.map((category) => (
                <Link
                  key={category}
                  href={`/blog?category=${category}`}
                  className={`px-6 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                    selectedCategory === category
                      ? 'bg-amber-100 text-amber-900 border border-amber-200'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {categoryLabels[category]}
                </Link>
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
      </main>

      <Footer />
    </div>
  );
}

