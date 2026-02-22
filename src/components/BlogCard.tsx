import Image from 'next/image';
import Link from 'next/link';
import { BlogPostMeta } from '@/types/blog';

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

interface BlogCardProps {
  post: BlogPostMeta;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="space-y-4">
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

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-700">
              {categoryLabels[post.category]}
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-stone-500">
              {post.readingTime || '5 min read'}
            </span>
          </div>

          <h2 className="font-serif text-2xl md:text-3xl text-stone-900 leading-tight group-hover:text-amber-700 transition-colors">
            {post.title}
          </h2>

          <p className="text-stone-600 leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>

          <div className="text-xs text-stone-400 font-medium">
            {formatDate(post.publishedAt)}
          </div>
        </div>
      </article>
    </Link>
  );
}
