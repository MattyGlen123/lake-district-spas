import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlogCategoryFilter from '@/components/BlogCategoryFilter';
import { getAllBlogPosts } from '@/lib/blog';

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

export default function BlogPage() {
  const allPosts = getAllBlogPosts();

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

        <BlogCategoryFilter allPosts={allPosts} />
      </main>

      <Footer />
    </div>
  );
}
