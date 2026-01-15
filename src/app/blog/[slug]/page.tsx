import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { ChevronRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SpaCard from '@/components/SpaCard';
import {
  getBlogPostBySlug,
  getAllBlogSlugs,
  getRelatedPosts,
} from '@/lib/blog';
import { spaData } from '@/data/spas';
import { BlogPostMeta } from '@/types/blog';
import { Spa } from '@/types/spa';

// Generate static params for all blog posts
export async function generateStaticParams() {
  const slugs = getAllBlogSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

// Generate metadata for each blog post
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.',
    };
  }

  const baseUrl = 'https://lakedistrictspas.co.uk';
  const pageUrl = `${baseUrl}/blog/${post.slug}`;
  const imageUrl = post.featuredImage
    ? `${baseUrl}${post.featuredImage}`
    : `${baseUrl}/images/lake-district-spas_hero.jpg`;
  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt;

  return {
    title: `${title} - Lake District Spas`,
    description,
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: 'Lake District Spas',
      images: [
        {
          url: imageUrl,
          alt: post.featuredImageAlt || post.title,
          width: 1200,
          height: 630,
        },
      ],
      locale: 'en_GB',
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

// Custom MDX components
const mdxComponents = {
  h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const id = children
      ? String(children)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')
      : '';
    return (
      <h2
        id={id}
        className="font-serif text-3xl md:text-4xl text-stone-900 mt-12 mb-6 first:mt-0"
        {...props}
      >
        <a
          href={`#${id}`}
          className="no-underline hover:text-amber-700 transition-colors"
        >
          {children}
        </a>
      </h2>
    );
  },
  h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const id = children
      ? String(children)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')
      : '';
    return (
      <h3
        id={id}
        className="font-serif text-2xl md:text-3xl text-stone-900 mt-10 mb-4"
        {...props}
      >
        <a
          href={`#${id}`}
          className="no-underline hover:text-amber-700 transition-colors"
        >
          {children}
        </a>
      </h3>
    );
  },
  p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="text-stone-700 leading-relaxed mb-6" {...props}>
      {children}
    </p>
  ),
  a: ({
    href,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    // Check if it's an internal spa link (/spa/...)
    if (href?.startsWith('/spa/')) {
      const spaSlug = href.replace('/spa/', '').replace(/\/$/, '');
      const spa = spaData.find((s) => s.url === spaSlug);
      if (spa) {
        return (
          <Link
            href={`/spa/${spa.url}`}
            className="text-emerald-700 hover:text-emerald-900 underline font-medium"
            {...props}
          >
            {children}
          </Link>
        );
      }
    }
    // Check if it's a Next.js internal link
    if (href?.startsWith('/')) {
      return (
        <Link
          href={href}
          className="text-emerald-700 hover:text-emerald-900 underline font-medium"
          {...props}
        >
          {children}
        </Link>
      );
    }
    // External link
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-emerald-700 hover:text-emerald-900 underline font-medium"
        {...props}
      >
        {children}
      </a>
    );
  },
  img: ({
    src,
    alt,
    width,
    height,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement>) => {
    if (!src) return null;
    return (
      <div className="my-8 rounded-xl overflow-hidden">
        <Image
          src={src}
          alt={alt || ''}
          width={typeof width === 'number' ? width : 1200}
          height={typeof height === 'number' ? height : 630}
          className="w-full h-auto"
          {...props}
        />
      </div>
    );
  },
  blockquote: ({
    children,
    ...props
  }: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="border-l-4 border-amber-300 pl-6 py-4 my-8 bg-amber-50/50 italic text-stone-700"
      {...props}
    >
      {children}
    </blockquote>
  ),
  ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      className="list-disc list-inside space-y-2 mb-6 text-stone-700"
      {...props}
    >
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: React.OlHTMLAttributes<HTMLOListElement>) => (
    <ol
      className="list-decimal list-inside space-y-2 mb-6 text-stone-700"
      {...props}
    >
      {children}
    </ol>
  ),
  li: ({ children, ...props }: React.LiHTMLAttributes<HTMLLIElement>) => (
    <li className="ml-4" {...props}>
      {children}
    </li>
  ),
  table: ({ children, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="overflow-x-auto my-8">
      <table
        className="min-w-full border-collapse border border-stone-200 rounded-lg"
        {...props}
      >
        {children}
      </table>
    </div>
  ),
  thead: ({
    children,
    ...props
  }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead className="bg-stone-100" {...props}>
      {children}
    </thead>
  ),
  th: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className="border border-stone-200 px-4 py-3 text-left font-semibold text-stone-900"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td className="border border-stone-200 px-4 py-3 text-stone-700" {...props}>
      {children}
    </td>
  ),
  SpaCard: ({ spaSlug }: { spaSlug: string }) => {
    const spa = spaData.find((s) => s.url === spaSlug);
    if (!spa) return null;
    return (
      <div className="my-8">
        <SpaCard spa={spa} />
      </div>
    );
  },
};

// Generate table of contents from headings
function generateTOC(content: string) {
  const headingRegex = /^###?\s+(.+)$/gm;
  const headings: Array<{ level: number; text: string; id: string }> = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const text = match[1];
    const level = match[0].startsWith('###') ? 3 : 2;
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    headings.push({ level, text, id });
  }

  return headings;
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(post.slug, 3);
  const toc = generateTOC(post.content);

  // Get spas mentioned in the article (limit to 2 most relevant)
  const mentionedSpas: Spa[] = post.relatedSpas
    ? post.relatedSpas
        .slice(0, 2)
        .map((slug) => spaData.find((s) => s.url === slug))
        .filter((s): s is Spa => s !== undefined)
    : [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const categoryLabels: Record<BlogPostMeta['category'], string> = {
    guides: 'Guides',
    comparisons: 'Comparisons',
    seasonal: 'Seasonal',
    facilities: 'Facilities',
    locations: 'Locations',
  };

  // Generate JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage
      ? `https://lakedistrictspas.co.uk${post.featuredImage}`
      : 'https://lakedistrictspas.co.uk/images/lake-district-spas_hero.jpg',
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: {
      '@type': 'Organization',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Lake District Spas',
      logo: {
        '@type': 'ImageObject',
        url: 'https://lakedistrictspas.co.uk/logo.svg',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://lakedistrictspas.co.uk/blog/${post.slug}`,
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <main>
        {/* Hero Section with Featured Image */}
        {post.featuredImage && (
          <div className="relative h-[50vh] min-h-[400px] max-h-[600px]">
            <Image
              src={post.featuredImage}
              alt={post.featuredImageAlt || post.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/40 to-transparent" />
          </div>
        )}

        <div className="container mx-auto px-4 md:px-8 py-8 md:py-12">
          <div className="max-w-4xl mx-auto">
            {/* Article Header */}
            <div className="mb-8">
              {/* Category and Reading Time */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-700">
                  {categoryLabels[post.category]}
                </span>
                <span className="text-stone-300">•</span>
                <span className="text-xs text-stone-500">
                  {post.readingTime || '5 min read'}
                </span>
                <span className="text-stone-300">•</span>
                <span className="text-xs text-stone-500">
                  {formatDate(post.publishedAt)}
                </span>
              </div>

              {/* Title */}
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-stone-900 mb-4 leading-tight">
                {post.title}
              </h1>

              {/* Author */}
              <div className="text-stone-600">
                By <span className="font-semibold">{post.author}</span>
              </div>
            </div>

            {/* Article Content with TOC Sidebar */}
            <div className="flex gap-12">
              {/* Main Content */}
              <article className="flex-1 min-w-0">
                <div className="prose prose-lg max-w-none">
                  <MDXRemote source={post.content} components={mdxComponents} />
                </div>
              </article>

              {/* Table of Contents - Desktop Only */}
              {toc.length > 0 && (
                <aside className="hidden lg:block w-64 flex-shrink-0">
                  <div className="sticky top-24">
                    <div className="bg-soft-cream rounded-xl p-6 border border-stone-100">
                      <h3 className="font-serif text-lg text-stone-900 mb-4">
                        Contents
                      </h3>
                      <nav className="space-y-2">
                        {toc.map((heading) => (
                          <a
                            key={heading.id}
                            href={`#${heading.id}`}
                            className={`block text-sm text-stone-600 hover:text-amber-700 transition-colors ${
                              heading.level === 3 ? 'ml-4' : ''
                            }`}
                          >
                            {heading.text}
                          </a>
                        ))}
                      </nav>
                    </div>
                  </div>
                </aside>
              )}
            </div>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="bg-soft-cream border-t border-stone-100 py-16">
            <div className="container mx-auto px-4 md:px-8">
              <h2 className="font-serif text-3xl md:text-4xl text-stone-900 mb-8">
                Related Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.slug}
                    href={`/blog/${relatedPost.slug}`}
                    className="group block"
                  >
                    <article className="space-y-4">
                      {relatedPost.featuredImage && (
                        <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-sm border border-stone-100">
                          <Image
                            src={relatedPost.featuredImage}
                            alt={
                              relatedPost.featuredImageAlt || relatedPost.title
                            }
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        </div>
                      )}
                      <div className="space-y-2">
                        <span className="text-xs font-bold uppercase tracking-widest text-amber-700">
                          {categoryLabels[relatedPost.category]}
                        </span>
                        <h3 className="font-serif text-xl text-stone-900 group-hover:text-amber-700 transition-colors">
                          {relatedPost.title}
                        </h3>
                        <p className="text-sm text-stone-600 line-clamp-2">
                          {relatedPost.excerpt}
                        </p>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Related Spas Section */}
        {mentionedSpas.length > 0 && (
          <section className="bg-slate-50 py-32">
            <div className="container mx-auto px-4 md:px-8">
              {/* Section Heading */}
              <div className="mb-16">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="h-px w-12 bg-amber-700 opacity-30" />
                  <span className="text-xs font-bold uppercase tracking-[0.4em] text-amber-700">
                    Explore More
                  </span>
                </div>
                <div className="flex items-end justify-between">
                  <h2 className="font-serif text-4xl md:text-5xl text-stone-900">
                    Spas Mentioned in This Article
                  </h2>
                  <Link
                    href="/"
                    className="text-stone-900 font-semibold flex items-center text-sm"
                  >
                    View All
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>

              {/* Spa Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-8">
                {mentionedSpas.map((spa) => (
                  <SpaCard key={spa.id} spa={spa} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
