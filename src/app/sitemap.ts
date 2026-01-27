import { MetadataRoute } from 'next';
import { spaData } from '@/data/spas';
import { getAllBlogPosts } from '@/lib/blog';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://lakedistrictspas.co.uk';

  // Homepage entry
  const homepage = {
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 1.0,
  };

  // About page entry
  const aboutPage = {
    url: `${baseUrl}/about`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  };

  // Partnership page entry
  const partnershipPage = {
    url: `${baseUrl}/partnership`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  };

  // Spa Days page entry
  const spaDaysPage = {
    url: `${baseUrl}/spa-days`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  };

  // Blog listing page entry
  const blogPage = {
    url: `${baseUrl}/blog`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  };

  // Location pages entries
  const locationPages = [
    {
      url: `${baseUrl}/location/spas-in-windermere`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/location/spas-in-ambleside`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/location/spas-in-appleby-in-westmorland`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ];

  // Blog post pages entries
  const blogPosts = getAllBlogPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Spa pages entries
  const spaPages = spaData.map((spa) => ({
    url: `${baseUrl}/spa/${spa.url}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [
    homepage,
    aboutPage,
    partnershipPage,
    spaDaysPage,
    blogPage,
    ...blogPosts,
    ...spaPages,
    ...locationPages,
  ];
}
